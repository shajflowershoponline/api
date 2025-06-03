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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const CustomerUser_1 = require("./CustomerUser");
const OrderItems_1 = require("./OrderItems");
let Order = class Order {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "OrderId" }),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "OrderCode", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "orderCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Order.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MobileNumber", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Email", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PaymentMethod" }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "DeliveryAddress" }),
    __metadata("design:type", String)
], Order.prototype, "deliveryAddress", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "DeliveryAddressLandmark",
        nullable: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "deliveryAddressLandmark", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "DeliveryAddressCoordinates", default: {} }),
    __metadata("design:type", Object)
], Order.prototype, "deliveryAddressCoordinates", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "DeliveryFee", default: () => "0" }),
    __metadata("design:type", String)
], Order.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PromoCode", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "promoCode", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Subtotal", default: () => "0" }),
    __metadata("design:type", String)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Discount", default: () => "0" }),
    __metadata("design:type", String)
], Order.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Total" }),
    __metadata("design:type", String)
], Order.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SpecialInstructions", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "specialInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "NotesToRider", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notesToRider", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "CreatedAt",
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DeliveryStateAt",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Order.prototype, "deliveryStateAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "CancelledStateAt",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Order.prototype, "cancelledStateAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "CompletedStateAt",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Order.prototype, "completedStateAt", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "CancelReason", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "cancelReason", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Order.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CustomerUser_1.CustomerUser, (customerUser) => customerUser.orders),
    (0, typeorm_1.JoinColumn)([
        { name: "CustomerUserId", referencedColumnName: "customerUserId" },
    ]),
    __metadata("design:type", CustomerUser_1.CustomerUser)
], Order.prototype, "customerUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderItems_1.OrderItems, (orderItems) => orderItems.order),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
Order = __decorate([
    (0, typeorm_1.Index)("Order_pkey", ["orderId"], { unique: true }),
    (0, typeorm_1.Entity)("Order", { schema: "dbo" })
], Order);
exports.Order = Order;
//# sourceMappingURL=Order.js.map