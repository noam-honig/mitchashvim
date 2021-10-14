import { ValueListFieldType } from "remult";

@ValueListFieldType(DeliveryStatus, {
    caption: 'שלב'
})
export class DeliveryStatus {
    static setup = new DeliveryStatus("הקמה");
    static readyForDelivery = new DeliveryStatus("מוכן למשלוח");
    static toSchedule = new DeliveryStatus("לתאום"); //יש תאריך מהנהג אבל עוד לא אושר על ידי הלקוח
    static scheduled = new DeliveryStatus("תואם");
    static completed = new DeliveryStatus("הושלם");
    static canceled = new DeliveryStatus("בוטל על ידי מתחשבים");
    static problem = new DeliveryStatus("בעיה");

    constructor(public caption: string) {

    }
} 