export class Building {

    private _building_fullname: string;
    private _building_shortname: string;
    private _building_address: string;
    // private _building_lat: number;
    // private _building_lon: number;

    constructor() {}

    public building_fullname(value: string) {
        this._building_fullname = value;
    }

    public building_shortname(value: string) {
        this._building_shortname = value;
    }

    public building_address(value: string) {
        this._building_address = value;
    }

    // public building_lat(value: number) {
    //     this._building_lat = value;
    // }
    //
    // public building_lon(value: number) {
    //     this._building_lon = value;
    // }

    public BuildingObj(): any {
        return {
            'building_fullname': this._building_fullname,
            'building_shortname': this._building_shortname,
            'building_address': this._building_address,
            // 'building_lat': this._building_lat,
            // 'building_lon': this._building_lon,
        };
    }




}