import { ValueListFieldType } from "remult";
import { SiteType } from "../sites/site-type";

@ValueListFieldType(DeliveryType, {
    caption: 'משימה'
})
export class DeliveryType {
    static pickup = new DeliveryType("איסוף", SiteType.donor, SiteType.lab);
    static delivery = new DeliveryType("חלוקה", SiteType.lab, SiteType.rashut);
    static transfer = new DeliveryType("העברה", SiteType.lab, SiteType.lab);

    constructor(public caption: string, public typeFrom: SiteType, public typeTo: SiteType) {

    }
}