import { DataControl, openDialog } from "@remult/angular";
import { DateOnlyField, Entity, Field, IdEntity } from "remult";
import { SelectSiteComponent } from "../select-site/select-site.component";
import { Site } from "../sites/site";
import { Roles } from "../users/roles";
import { DeliveryStatus } from "./delivery-status";
import { DeliveryType } from "./delivery-type";

@Entity("deliveries", {
    allowApiCrud: Roles.admin
})
export class Delivery extends IdEntity {
    @Field()
    type: DeliveryType = DeliveryType.pickup;
    @Field()
    status: DeliveryStatus = DeliveryStatus.setup;
    @DataControl<Delivery>({
        click: async (self, f) => {
            openDialog(SelectSiteComponent, x => x.args = {
                onSelect: site => f.value = site,
                title: f.metadata.caption,
                siteType: self.type.typeFrom

            })
        }
    })
    @Field({ caption: 'מאיפה?' })
    source!: Site;
    @DataControl<Delivery>({
        click: async (self, f) => {
            openDialog(SelectSiteComponent, x => x.args = {
                onSelect: site => f.value = site,
                title: f.metadata.caption,
                siteType: self.type.typeTo

            })
        }
    })
    @Field({ caption: 'לאן' })
    target!: Site;
    @Field({ caption: 'משטחים' })
    surfaces: number = 0;
    @Field({ caption: 'ניידים' })
    laptops: number = 0;
    @Field({ caption: 'מסכים' })
    screens: number = 0;
    @Field({ caption: 'מחשבים' })
    computers: number = 0;
    @Field({ caption: 'אחר' })
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
    @Field({ caption: 'הערות איסוף' })
    pickupTimeComment: string = '';
    @Field({ caption: 'איסוף תואם' })
    pickupTimeConfirmed: boolean = false;

    @DateOnlyField({ caption: 'תאריך למסירה', allowNull: true })
    deliveryDate?: Date;
    @Field({ caption: 'שעות מסירה' })
    deliveryTime: string = '';
    @Field({ caption: 'שעות מסירה' })
    deliveryTimeComment: string = '';
    @Field({ caption: 'מסירה תואמה' })
    deliveryTimeConfirmed: boolean = false;

}