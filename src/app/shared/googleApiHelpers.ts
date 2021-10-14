import { FieldRef, FieldType, Remult } from "remult";


@FieldType({
    valueConverter: {
        fromJson: (x: GeocodeResult) => {
            if (typeof x === "string")
                if (x== "")
                    return new GeocodeInformation();
                else
                    x = JSON.parse(x);
            return new GeocodeInformation(x);
        },
        toJson: x => x.info
    }
})
export class GeocodeInformation {
    info!: GeocodeResult;
    constructor(info?: GeocodeResult) {
        if (!info)
            this.info = { results: [], status: 'none' };
        else this.info = info;
    }
    getAddress() {
        if (!this.ok())
            return 'INVALID ADDRESS';
        return getAddress(this.info.results[0]);

    }
    public saveToString() {
        return JSON.stringify(this.info);
    }
    static fromString(s: string) {
        try {
            if (s && s.trim() != "")
                return new GeocodeInformation(JSON.parse(s));
        }
        catch (err) {
        }
        return new GeocodeInformation(undefined!);
    }
    ok() {
        return this.info.status == "OK";
    }
    partialMatch() {
        if (this.whyProblem())
            return true;
        return false;
    }
    whyProblem() {
        if (!this.ok())
            return this.info.status;
        if (this.info.results.length < 1)
            return "no results";
        if (this.info.results[0].address_components.length > 0 && this.info.results[0].address_components[0].types[0] == "street_number")
            return undefined;
        if (this.info.results[0].partial_match)
            return "partial_match";
        if (this.info.results[0].types[0] != "street_address"
            && this.info.results[0].types[0] != "subpremise"
            && this.info.results[0].types[0] != "premise"
            && this.info.results[0].types[0] != "route"
            && this.info.results[0].types[0] != "intersection"
            && this.info.results[0].types[0] != "establishment")
            return this.info.results[0].types.join(',');
        return undefined;
    }
    location(): Location {
        if (!this.ok())
            return { lat: 32.0922212, lng: 34.8731951 };
        return this.info.results[0].geometry.location;
    }
    getLongLat() {
        return toLongLat(this.location());
    }
    getCity() {
        if (this.ok())
            return getCity(this.info.results[0].address_components);
        return undefined;
    }

}
export function getAddress(result: { formatted_address?: string, address_components?: AddressComponent[] }) {
    let r = result.formatted_address;
    if (!r)
        return "UNKNOWN";
    if (result.address_components)
        for (let index = result.address_components.length - 1; index >= 0; index--) {
            const x = result.address_components[index];
            if (x.types[0] == "country" || x.types[0] == "postal_code") {
                let i = r.lastIndexOf(', ' + x.long_name);
                if (i > 0)
                    r = r.substring(0, i) + r.substring(i + x.long_name.length + 2);
            }
            if (x.types[0] == "administrative_area_level_2" && x.short_name.length == 2) {
                let i = r.lastIndexOf(' ' + x.short_name);
                if (i > 0)
                    r = r.substring(0, i) + r.substring(i + x.long_name.length + 1);

            }
        };

    r = r.trim();
    if (r.endsWith(',')) {
        r = r.substring(0, r.length - 1);
    }
    return r;
}
export function getCity(address_component: AddressComponent[]) {
    let r = undefined;
    address_component.forEach(x => {
        if (x.types[0] == "locality")
            r = x.long_name;
    });
    if (!r)
        address_component.forEach(x => {
            if (x.types[0] == "postal_town")
                r = x.long_name;
        });
    if (!r)
        return "UNKNOWN";
    return r;
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Location {
    lat: number;
    lng: number;
}

interface Viewport {
    northeast: Location;
    southwest: Location;
}

interface Geometry {
    location: Location;
    location_type: string;
    viewport: Viewport;
}

interface Result {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    partial_match: boolean;
    place_id: string;
    types: string[];
}

export interface GeocodeResult {
    results: Result[];
    status: string;
}

function toLongLat(l: Location) {
    return l.lat + ',' + l.lng;
}