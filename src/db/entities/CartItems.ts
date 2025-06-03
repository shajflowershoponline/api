import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CustomerUser } from "./CustomerUser";
import { Product } from "./Product";

@Index("CartItems_pkey", ["cartItemId"], { unique: true })
@Entity("CartItems", { schema: "dbo" })
export class CartItems {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CartItemId" })
  cartItemId: string;

  @Column("timestamp with time zone", {
    name: "CreatedAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "UpdatedAt", nullable: true })
  updatedAt: Date | null;

  @Column("numeric", { name: "Quantity", default: () => "1" })
  quantity: string;

  @Column("numeric", { name: "Price", default: () => "0" })
  price: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => CustomerUser, (customerUser) => customerUser.cartItems)
  @JoinColumn([
    { name: "CustomerUserId", referencedColumnName: "customerUserId" },
  ])
  customerUser: CustomerUser;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn([{ name: "ProductId", referencedColumnName: "productId" }])
  product: Product;
}
