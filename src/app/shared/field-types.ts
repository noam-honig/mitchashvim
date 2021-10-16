import * as remult from 'remult';
import * as rAngular from '@remult/angular';
import { DataControl, DataControlSettings } from '@remult/angular';
export function DateOnlyField<entityType = any>(...options: (remult.FieldOptions<entityType, Date> | ((options: remult.FieldOptions<entityType, Date>, remult: remult.Remult) => void))[]) {
    return remult.DateOnlyField<entityType>({
        displayValue: (_, date) => date?.toLocaleDateString('he-il')
    }, ...options);
}
export function PhoneControl<entityType = any>(settings?: DataControlSettings<entityType, string>) {
    return DataControl<entityType>({
        clickIcon:'phone',
        click: (_, col) => {
            if (col.value)
                window.open("tel:" + col.value);
        },
        allowClick: (_, col) => col.value && col.value.length >= 9
        ,
        ...settings
    });
}
