export class Room {

    private _rooms_fullname: string;
    private _rooms_shortname: string;
    private _rooms_number: string;
    private _rooms_name: string;
    private _rooms_address: string;
    private _rooms_lat: number;
    private _rooms_lon: number;
    private _rooms_seats: number;
    private _rooms_type: string;
    private _rooms_furniture: string;
    private _rooms_href: string;

    constructor() {}

    public rooms_fullname(value: string) {
        this._rooms_fullname = value;
    }

    public rooms_shortname(value: string) {
        this._rooms_shortname = value;
    }

    public rooms_number(value: string) {
        this._rooms_number = value;
    }

    public rooms_name(value: string) {
        this._rooms_name = value;
    }

    public rooms_address(value: string) {
        this._rooms_address = value;
    }

    public rooms_lat(value: number) {
        this._rooms_lat = value;
    }

    public rooms_lon(value: number) {
        this._rooms_lon = value;
    }

    public rooms_seats(value: number) {
        this._rooms_seats = value;
    }

    public rooms_type(value: string) {
        this._rooms_type = value;
    }

    public rooms_furniture(value: string) {
        this._rooms_furniture = value;
    }

    public rooms_href(value: string) {
        this._rooms_href = value;
    }

    public RoomObj(): Object {
        return {
            'rooms_fullname': this._rooms_fullname,
            'rooms_shortname': this._rooms_shortname,
            'rooms_number': this._rooms_number,
            'rooms_name': this._rooms_name,
            'rooms_address': this._rooms_address,
            'rooms_lat': this._rooms_lat,
            'rooms_lon': this._rooms_lon,
            'rooms_seats': this._rooms_seats,
            'rooms_type': this._rooms_type,
            'rooms_furniture': this._rooms_furniture,
            'rooms_href': this._rooms_href
        };
    }




}