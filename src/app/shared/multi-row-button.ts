import { GridSettings, RowButton } from "@remult/angular";
import { IdEntity, Remult } from "remult";
import '../terms';



export async function deliveriesClick<entityType extends IdEntity>(settings: GridSettings<entityType>, remult: Remult, e: entityType, click: (e: entityType) => Promise<any>, reloadWhenDone = false) {

    if (settings.selectedRows.length > 0) {
        if (await remult.yesNoQuestion("לעדכן " + settings.selectedRows.length + " משלוחים?")) {
            for (const d of settings.selectedRows) {
                await click(d);
            }
        }
    } else {
        await click(e);
    }
    if (reloadWhenDone) {
        settings.selectedRows.splice(0);
        settings.reloadData();
    }


}