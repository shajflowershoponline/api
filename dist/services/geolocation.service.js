"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let GeolocationService = class GeolocationService {
    constructor(config, httpService) {
        this.config = config;
        this.httpService = httpService;
        this.MAXIM_LOCATION_SERVICE_URL = this.config.get("MAXIM_LOCATION_SERVICE_URL");
    }
    async search(query) {
        var _a;
        const url = `${this.MAXIM_LOCATION_SERVICE_URL}/search-address/?q=${encodeURIComponent(query)}&placeId=&org=maxim&baseId=7513`;
        try {
            const response$ = this.httpService.get(url, {
                headers: {
                    Cookie: "_ym_uid=1741935619482784566; _ym_d=1741935619; _ga_DE381TZ7F1=GS2.1.s1747982128$o1$g1$t1747985784$j0$l0$h0; _gcl_au=1.1.1228314376.1747985786; _tt_enable_cookie=1; _ttp=01JVY14SWTVMC26CH1N7Y44Y8P_.tt.1; tmr_lvid=eb8bd2a85f77e5ae58aec2b03807e264; tmr_lvidTS=1744020762368; __intl=4058a3d05a88111ba5adeff371e63c0c412460e129cf68505ccc8b4800df3bb6a%3A2%3A%7Bi%3A0%3Bs%3A6%3A%22__intl%22%3Bi%3A1%3Bs%3A5%3A%22en-US%22%3B%7D; __finger_print_hash=8d266d96247ad41e434a9df31a49f34150c2b5d28951bb4aeabe17fdf8ad7c3ba%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22__finger_print_hash%22%3Bi%3A1%3Bs%3A36%3A%22ac4e7a70-4c1f-457f-b115-c5ac1bfbbb87%22%3B%7D; __taxsee_country=d34f44bdfce0cfc5dc90be590b6da8a836250ee98975117c7d4ff262e06549e6a%3A2%3A%7Bi%3A0%3Bs%3A16%3A%22__taxsee_country%22%3Bi%3A1%3Bs%3A2%3A%22PH%22%3B%7D; _gid=GA1.2.1253647908.1748350564; _ym_isad=2; _ym_visorc=w; __taxsee_org=623dfc602a7ce2c7b2c6b9c4b304d41afb4a57a445a0042424ce00d096d49f81a%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22__taxsee_org%22%3Bi%3A1%3Bs%3A5%3A%22maxim%22%3B%7D; __identity_v3_maxim=986929cd66b4dbbecea7deda0798ea60fa91223e21ffb0652e0f7a7c3ddaf61fa%3A2%3A%7Bi%3A0%3Bs%3A19%3A%22__identity_v3_maxim%22%3Bi%3A1%3Bs%3A64%3A%22%5B%22639950431207%22%2C%22E7B9F747-07EF-4BA2-8435-D791D94ABE90%22%2C31536000%5D%22%3B%7D; _ga_3SG405Q2PJ=GS2.2.s1748351361$o1$g1$t1748351423$j0$l0$h0; TAXSEE_V3MAXIM=179h08s7gdi9j0nm4oho87dbhr; _csrf=593cc2e5119a0385725b2b7cfe0530ad973bb66e1bd0841bd99d5df912d59cd0a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22oDlNhyr5k7DwtNfFXxblWrX6t39mxCx9%22%3B%7D; __taxsee_base=c596e5d2632ba3f463522e95a7441db31fec0d251f84bae8b50ad097af696fa1a%3A2%3A%7Bi%3A0%3Bs%3A13%3A%22__taxsee_base%22%3Bi%3A1%3Bi%3A7513%3B%7D; __profile_fill_ignoreafter_auth=15b16fa34ea45ca3125ca57c6774990421bc3c8c689e5565f941eb23c4812531a%3A2%3A%7Bi%3A0%3Bs%3A31%3A%22__profile_fill_ignoreafter_auth%22%3Bi%3A1%3Bi%3A1%3B%7D; _ga_T2DPT2GHZ5=GS2.1.s1748350563$o1$g1$t1748352163$j0$l0$h0; _ga=GA1.1.1045534391.1747982129; ttcsid=1748350562123::zQ3K9EFKmi2I4nWxgQ2k.2.1748352163795; tmr_detect=0%7C1748352166271; ttcsid_CK43S33C77U0C3L9V4DG=1748350562122::Vqfb0QRJTGLosBlOqtps.2.1748352166495; _ga_16MGM3R9TE=GS2.1.s1748350561$o2$g1$t1748352169$j11$l0$h0$dCF5FYYxhXLEvAVLytzdU0yjW23mhgIg9Sw",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const response = await (0, rxjs_1.lastValueFrom)(response$);
            return response.data.map((x) => {
                var _a, _b, _c, _d;
                return {
                    address: x.name,
                    coordinates: {
                        lat: (_b = (_a = x.address) === null || _a === void 0 ? void 0 : _a.point) === null || _b === void 0 ? void 0 : _b.lat,
                        lng: (_d = (_c = x.address) === null || _c === void 0 ? void 0 : _c.point) === null || _d === void 0 ? void 0 : _d.lon,
                    },
                };
            });
        }
        catch (error) {
            console.error("Error in GeolocationService.search:", ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new Error("Failed to fetch location search results");
        }
    }
};
GeolocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], GeolocationService);
exports.GeolocationService = GeolocationService;
//# sourceMappingURL=geolocation.service.js.map