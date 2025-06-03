import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Index("OrderItems_pkey", ["orderItemId"], { unique: true })
@Entity("OrderItems", { schema: "dbo" })
export class OrderItems {
  @PrimaryGeneratedColumn({ type: "bigint", name: "OrderItemId" })
  orderItemId: string;

  @Column("numeric", { name: "Quantity", default: () => "1" })
  quantity: string;

  @Column("numeric", { name: "Price", default: () => "0" })
  price: string;

  @Column("numeric", { name: "TotalAmount", default: () => "0" })
  totalAmount: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn([{ name: "OrderId", referencedColumnName: "orderId" }])
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn([{ name: "ProductId", referencedColumnName: "productId" }])
  product: Product;
}
