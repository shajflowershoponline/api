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
exports.OrderItems = void 0;
const typeorm_1 = require("typeorm");
const Order_1 = require("./Order");
const Product_1 = require("./Product");
let OrderItems = class OrderItems {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "OrderItemId" }),
    __metadata("design:type", String)
], OrderItems.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Quantity", default: () => "1" }),
    __metadata("design:type", String)
], OrderItems.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Price", default: () => "0" }),
    __metadata("design:type", String)
], OrderItems.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalAmount", default: () => "0" }),
    __metadata("design:type", String)
], OrderItems.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], OrderItems.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, (order) => order.orderItems),
    (0, typeorm_1.JoinColumn)([{ name: "OrderId", referencedColumnName: "orderId" }]),
    __metadata("design:type", Order_1.Order)
], OrderItems.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.orderItems),
    (0, typeorm_1.JoinColumn)([{ name: "ProductId", referencedColumnName: "productId" }]),
    __metadata("design:type", Product_1.Product)
], OrderItems.prototype, "product", void 0);
OrderItems = __decorate([
    (0, typeorm_1.Index)("OrderItems_pkey", ["orderItemId"], { unique: true }),
    (0, typeorm_1.Entity)("OrderItems", { schema: "dbo" })
], OrderItems);
exports.OrderItems = OrderItems;
//# sourceMappingURL=OrderItems.js.map