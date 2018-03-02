"use strict";
var Room = (function () {
    function Room() {
    }
    Room.prototype.rooms_fullname = function (value) {
        this._rooms_fullname = value;
    };
    Room.prototype.rooms_shortname = function (value) {
        this._rooms_shortname = value;
    };
    Room.prototype.rooms_number = function (value) {
        this._rooms_number = value;
    };
    Room.prototype.rooms_name = function (value) {
        this._rooms_name = value;
    };
    Room.prototype.rooms_address = function (value) {
        this._rooms_address = value;
    };
    Room.prototype.rooms_lat = function (value) {
        this._rooms_lat = value;
    };
    Room.prototype.rooms_lon = function (value) {
        this._rooms_lon = value;
    };
    Room.prototype.rooms_seats = function (value) {
        this._rooms_seats = value;
    };
    Room.prototype.rooms_type = function (value) {
        this._rooms_type = value;
    };
    Room.prototype.rooms_furniture = function (value) {
        this._rooms_furniture = value;
    };
    Room.prototype.rooms_href = function (value) {
        this._rooms_href = value;
    };
    Room.prototype.RoomObj = function () {
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
    };
    return Room;
}());
exports.Room = Room;
//# sourceMappingURL=Room.js.map