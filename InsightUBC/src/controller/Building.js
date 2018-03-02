"use strict";
var Building = (function () {
    function Building() {
    }
    Building.prototype.building_fullname = function (value) {
        this._building_fullname = value;
    };
    Building.prototype.building_shortname = function (value) {
        this._building_shortname = value;
    };
    Building.prototype.building_address = function (value) {
        this._building_address = value;
    };
    Building.prototype.BuildingObj = function () {
        return {
            'building_fullname': this._building_fullname,
            'building_shortname': this._building_shortname,
            'building_address': this._building_address,
        };
    };
    return Building;
}());
exports.Building = Building;
//# sourceMappingURL=Building.js.map