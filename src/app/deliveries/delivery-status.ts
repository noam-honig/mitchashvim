import { ValueListFieldType } from "remult";

@ValueListFieldType(DeliveryStatus, {
    caption: 'שלב'
})
export class DeliveryStatus {
    static setup = new DeliveryStatus("הקמה");
    static readyForDelivery = new DeliveryStatus("מוכן למשלוח");
    static scheduled = new DeliveryStatus("תואם");
    static pickedUp = new DeliveryStatus("נאסף");
    static delivered = new DeliveryStatus("נמסר");
    static canceled = new DeliveryStatus("בוטל");

    constructor(public caption: string) {

    }
}