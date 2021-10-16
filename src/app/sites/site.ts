import { DataControl, openDialog } from "@remult/angular";
import { Entity, Field, FieldType, IdEntity, Remult } from "remult";
import { SelectSiteComponent } from "../select-site/select-site.component";
import { PhoneControl } from "../shared/field-types";
import { GeocodeInformation } from "../shared/googleApiHelpers";
import { requiredInHebrew } from "../terms";
import { Roles } from "../users/roles";
import { SiteType } from "./site-type";

@DataControl<any, Site>({
    hideDataOnInput: true,
    getValue: (_, f) => f.value?.name,
    click: async (_, f) => {
        openDialog(SelectSiteComponent, x => x.args = {
            onSelect: site => f.value = site,
            title: f.metadata.caption,
            siteType: SiteType.donor

        })
    }
})
@FieldType<Site>({
    validate: (_, self) => {
        if (self.valueIsNull())
            self.error = "חובה לבחור אתר"
    },
    displayValue: (_, self) => self?.name

})
@Entity<Site>("sites", {
    allowApiCrud: Roles.sites,
    defaultOrderBy: self => self.name
})
export class Site extends IdEntity {
    @Field()
    type: SiteType = SiteType.donor;
    @Field({ caption: 'שם', validate: requiredInHebrew })
    name: string = '';
    @Field({ caption: 'כתובת', validate: requiredInHebrew })
    address: string = '';
    @Field({})
    addressApiResult: GeocodeInformation = new GeocodeInformation();
    @PhoneControl()
    @Field({ caption: 'טלפון', validate: requiredInHebrew })
    phone: string = '';
    @Field({ caption: 'איש קשר', validate: requiredInHebrew })
    contactPerson: string = '';
    @Field({ caption: 'הערת זמינות' })
    commentForCourier: string = '';
    @Field()
    deleted: boolean = false;

}