import { DataControl, openDialog } from "@remult/angular";
import { Entity, Field, IdEntity, Remult } from "remult";
import { SelectSiteComponent } from "../select-site/select-site.component";
import { AddressHelper } from "../shared/googleApiHelpers";
import { Roles } from "../users/roles";
import { SiteType } from "./site-type";

@DataControl<any, Site>({
    hideDataOnInput: true,
    getValue: (_, f) => f.value?.name,
    click: async (_, f) => {
        openDialog(SelectSiteComponent, x => x.args = {
            onSelect: site => f.value = site,
            title: f.metadata.caption,
            siteType:SiteType.donor

        })
    }
})
@Entity("sites", {
    allowApiCrud: Roles.sites
})
export class Site extends IdEntity {
    @Field()
    type: SiteType = SiteType.donor;
    @Field({ caption: 'שם' }) 
    name: string = '';
    @Field({ caption: 'כתובת' })
    address: string = '';
    @Field()
    addressApiResult: string = '';
    addressHelper = new AddressHelper(this.remult, () => this.$.address, () => this.$.addressApiResult);
    @Field({ caption: 'טלפון' })
    phone: string = '';
    @Field({ caption: 'איש קשר' })
    contactPerson: string = '';
    @Field({ caption: 'הערת זמינות' })
    commentForCourier: string = '';
    constructor(private remult: Remult) {
        super();
    }
}