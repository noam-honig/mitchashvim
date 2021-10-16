import { DataControl, DataControlSettings, openDialog } from "@remult/angular";
import { Entity, Field, FieldMetadata, FieldRef, FieldsMetadata, Filter, IdEntity, IntegerField, isBackend, Remult, Validators } from "remult";
import { SelectSiteComponent } from "../select-site/select-site.component";
import { DateOnlyField, PhoneControl } from "../shared/field-types";
import { GeocodeInformation } from "../shared/googleApiHelpers";
import { Site } from "../sites/site";
import { requiredInHebrew } from "../terms";
import { change, ChangeLog } from "../track-changes/change-log";
import { Roles } from "../users/roles";
import { DeliveryStatus } from "./delivery-status";
import { DeliveryType } from "./delivery-type";


@Entity<Delivery>("deliveries", {
    allowApiCrud: Roles.admin,
    defaultOrderBy: self => self.number
},
    (options, remult) => options.
        saving = async self => {
            if (!self.other && !self.computers && !self.surfaces && !self.screens && !self.laptops) {
                throw "חובה להזין כמות כל שהיא";
            }
            if (self.number == 0) {
                self.number = (await self._.repository.findFirst({ orderBy: d => d.number.descending() }))?.number + 1 || 1;
            }
            if (!self.isNew() && isBackend()) {
                let changes = [] as change[];

                let exclude = [self.$.pickupAddressApiResult, self.$.deliveryAddressApiResult];
                for (const c of [...self.$].filter(c => !exclude.includes(c)).filter(c => c.valueChanged())) {
                    try {
                        changes.push({
                            key: c.metadata.key,
                            oldDisplayValue: c.metadata.options.displayValue ? c.metadata.options.displayValue(self, c.originalValue) : c.originalValue,
                            newDisplayValue: c.displayValue,
                            newValue: (c.value instanceof IdEntity) ? c.value.id : c.value,
                            oldValue: (c.originalValue instanceof IdEntity) ? c.originalValue.id : c.originalValue
                        })
                    } catch (err) {
                        console.log(c);
                        throw err;

                    }
                }


                if (changes.length > 0) {
                    let c = await remult.repo(ChangeLog).findFirst({ where: c => c.relatedId.isEqualTo(self.id), createIfNotFound: true });
                    c.changes = [{
                        date: new Date(),
                        userId: remult.user.id,
                        userName: remult.user.name,
                        changes
                    }, ...c.changes];


                    await c.save();
                }

            }
        }
)

export class Delivery extends IdEntity {
    @DataControl({ width: '70' })
    @IntegerField({ allowApiUpdate: false, caption: 'מספר' })
    number: number = 0;
    @DataControl({ width: '70' })
    @Field()
    type: DeliveryType = DeliveryType.pickup;
    @DataControl({ width: '100' })
    @Field()
    status: DeliveryStatus = DeliveryStatus.setup;
    @DataControl<Delivery>({
        click: async (self, f) => {
            openDialog(SelectSiteComponent, x => x.args = {
                onSelect: site => {
                    f.value = site;

                    self.pickupAddress = site.address;
                    self.pickupAddressApiResult = site.addressApiResult;
                    self.pickupCity = site.addressApiResult.getCity()!;
                    self.pickupContactPerson = site.contactPerson;
                    self.pickupPhone = site.phone;
                    self.pickupTimeComment = site.commentForCourier;
                },
                title: f.metadata.caption,
                siteType: self.type.typeFrom

            })
        }
    })
    @Field({ caption: 'איסוף', dbName: 'source' })
    source!: Site;
    @DataControl<Delivery>({
        click: async (self, f) => {
            openDialog(SelectSiteComponent, x => x.args = {
                onSelect: site => {
                    f.value = site;
                    self.deliveryAddress = site.address;
                    self.deliveryAddressApiResult = site.addressApiResult;
                    self.deliveryCity = site.addressApiResult.getCity()!;
                    self.deliveryContactPerson = site.contactPerson;
                    self.deliveryPhone = site.phone;
                    self.deliveryTimeComment = site.commentForCourier;
                },
                title: f.metadata.caption,
                siteType: self.type.typeTo

            })
        }
    })
    @Field({ caption: 'מסירה', dbName: 'target' })
    target!: Site;
    @DataControl({ width: '70' })
    @IntegerField({ caption: 'משטחים' })
    surfaces: number = 0;
    @DataControl({ width: '70' })
    @IntegerField({ caption: 'לפטופים' })
    laptops: number = 0;
    @DataControl({ width: '70' })
    @IntegerField({ caption: 'מסכים' })
    screens: number = 0;
    @DataControl({ width: '70' })
    @IntegerField({ caption: 'מחשבים' })
    computers: number = 0;
    @DataControl({ width: '70' })
    @IntegerField({ caption: 'אחר' })
    other: number = 0;
    @Field({ caption: 'הערות' })
    notes: string = '';
    @Field({ caption: 'תאריך יצירה' })
    createDate: Date = new Date();
    @Field({ caption: 'תאריך מוכן למשלוח' })
    readyDate?: Date;

    @DateOnlyField({ caption: 'תאריך לאיסוף', allowNull: true })
    pickupDate?: Date;
    @Field({ caption: 'שעות איסוף' })
    pickupTime: string = '';
    @Field({ caption: 'איסוף תואם' })
    pickupTimeConfirmed: boolean = false;
    @Field({ caption: 'כתובת איסוף', validate: requiredInHebrew })
    pickupAddress: string = '';
    @Field()
    pickupAddressApiResult: GeocodeInformation = new GeocodeInformation();
    @Field({ caption: 'עיר איסוף', validate: requiredInHebrew })
    pickupCity: string = '';
    @Field({ caption: 'איש קשר לאיסוף', validate: requiredInHebrew })
    pickupContactPerson: string = '';

    @PhoneControl()
    @Field({ caption: 'טלפון לאיסוף', validate: requiredInHebrew })
    pickupPhone: string = '';
    @Field({ caption: 'הערות איסוף' })
    pickupTimeComment: string = '';


    @DateOnlyField({ caption: 'תאריך למסירה', allowNull: true })
    deliveryDate?: Date;
    @Field({ caption: 'שעות מסירה' })
    deliveryTime: string = '';
    @Field({ caption: 'מסירה תואמה' })
    deliveryTimeConfirmed: boolean = false;
    @Field({ caption: 'כתובת למסירה', validate: requiredInHebrew })
    deliveryAddress: string = '';
    @Field()
    deliveryAddressApiResult: GeocodeInformation = new GeocodeInformation();
    @Field({ caption: 'עיר למסירה', validate: requiredInHebrew })
    deliveryCity: string = '';
    @Field({ caption: 'איש קשר למסירה', validate: requiredInHebrew })
    deliveryContactPerson: string = '';
    @PhoneControl()
    @Field({ caption: 'טלפון למסירה', validate: requiredInHebrew })
    deliveryPhone: string = '';
    @Field({ caption: 'הערות מסירה' })
    deliveryTimeComment: string = '';

    @Field({ caption: 'הערות משינוע חברתי למתחשבים' })
    notesForMitchashvim: string = '';
    @IntegerField({ caption: 'משטחים בפועל' })
    actualSurfaces: number = 0;

    @Field({ caption: 'ארכיב' })
    archive: boolean = false;

    @Field({ caption: 'שינוי נצפה ע"י שינוע חברתי' })
    changeSeenByDeliveryManager: boolean = true;//ברירת מחדל TRUE כדי שלא יראו משלוחים חדשים לגמרי
    @DataControl({ width: '90' })
    @Field({ caption: 'הודפס לנהג' })
    printedToDriver: boolean = false;

    rowCss() {
        return (!this.changeSeenByDeliveryManager ? 'unread' : '') + (this.archive ? ' archive' : '');
    }


    static colsInGrid = 15;
    static deliveryColumns(d: FieldsMetadata<Delivery>) {
        let r = [] as DataControlSettings<Delivery>[];
        function add(...fields: FieldMetadata[]) {
            r.push(...fields.map(x => ({ field: x })));
        }
        add(d.number, d.type, d.status, d.source);
        r.push({
            field: d.pickupCity,
            getValue: (d) => d.pickupCity + " => " + d.deliveryCity,
            caption: 'ערים'
        });
        add(d.target, d.notes, d.surfaces, d.laptops, d.screens, d.computers, d.other, d.pickupDate!, d.deliveryDate!, d.printedToDriver);
        r.push(...[...d].filter(x => x != d.id).map(f => ({ field: f })));
        return r;
    }

    static activeDeliveryFilter = Filter.createCustom<Delivery>(d =>
        d.status.isIn([
            DeliveryStatus.toSchedule,
            DeliveryStatus.scheduled,
            DeliveryStatus.readyForDelivery
        ]));

}


