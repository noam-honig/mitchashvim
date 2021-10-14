import { ValueListFieldType } from "remult";

@ValueListFieldType(SiteType, {
    caption: 'סוג אתר'
})
export class SiteType {
    static donor = new SiteType('תורם');
    static lab = new SiteType('מעבדה');
    static rashut = new SiteType("רשות מקומית");

    constructor(public caption: string) {

    }
}