import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerUser } from "./CustomerUser";
import { OrderItems } from "./OrderItems";

@Index("Order_pkey", ["orderId"], { unique: true })
@Entity("Order", { schema: "dbo" })
export class Order {
  @PrimaryGeneratedColumn({ type: "bigint", name: "OrderId" })
  orderId: string;

  @Column("character varying", { name: "OrderCode", nullable: true })
  orderCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "MobileNumber", nullable: true })
  mobileNumber: string | null;

  @Column("character varying", { name: "Email", nullable: true })
  email: string | null;

  @Column("character varying", { name: "PaymentMethod" })
  paymentMethod: string;

  @Column("character varying", { name: "DeliveryAddress" })
  deliveryAddress: string;

  @Column("character varying", {
    name: "DeliveryAddressLandmark",
    nullable: true,
  })
  deliveryAddressLandmark: string | null;

  @Column("jsonb", { name: "DeliveryAddressCoordinates", default: {} })
  deliveryAddressCoordinates: object;

  @Column("numeric", { name: "DeliveryFee", default: () => "0" })
  deliveryFee: string;

  @Column("character varying", { name: "PromoCode", nullable: true })
  promoCode: string | null;

  @Column("numeric", { name: "Subtotal", default: () => "0" })
  subtotal: string;

  @Column("numeric", { name: "Discount", default: () => "0" })
  discount: string;

  @Column("numeric", { name: "Total", default: () => "0" })
  total: string;

  @Column("character varying", { name: "SpecialInstructions", nullable: true })
  specialInstructions: string | null;

  @Column("character varying", { name: "NotesToRider", nullable: true })
  notesToRider: string | null;

  @Column("timestamp with time zone", {
    name: "CreatedAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "DeliveryStateAt",
    nullable: true,
  })
  deliveryStateAt: Date | null;

  @Column("timestamp with time zone", {
    name: "CancelledStateAt",
    nullable: true,
  })
  cancelledStateAt: Date | null;

  @Column("timestamp with time zone", {
    name: "CompletedStateAt",
    nullable: true,
  })
  completedStateAt: Date | null;

  @Column("character varying", { name: "CancelReason", nullable: true })
  cancelReason: string | null;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "Status", default: () => "'PENDING'" })
  status: string;

  @ManyToOne(() => CustomerUser, (customerUser) => customerUser.orders)
  @JoinColumn([
    { name: "CustomerUserId", referencedColumnName: "customerUserId" },
  ])
  customerUser: CustomerUser;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];
}
