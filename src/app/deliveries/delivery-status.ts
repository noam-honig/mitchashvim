import { ValueListFieldType } from "remult";

@ValueListFieldType(DeliveryStatus, {
    caption: 'שלב'
})
export class DeliveryStatus {
    static setup = new DeliveryStatus("הקמה", false);
    static readyForDelivery = new DeliveryStatus("מוכן למשלוח", true);
    static toSchedule = new DeliveryStatus("לתאום", true); //יש תאריך מהנהג אבל עוד לא אושר על ידי הלקוח
    static scheduled = new DeliveryStatus("תואם", true);
    static completed = new DeliveryStatus("הושלם", true);
    static canceled = new DeliveryStatus("בוטל על ידי מתחשבים", true);
    static problem = new DeliveryStatus("בעיה", false);

    constructor(public caption: string, public highlightChangeToDeliveryManager: boolean) {

    }
}