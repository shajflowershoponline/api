import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Collection } from "./Collection";
import { Product } from "./Product";

@Index("ProductCollection_pkey", ["productCollectionId"], { unique: true })
@Entity("ProductCollection", { schema: "dbo" })
export class ProductCollection {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ProductCollectionId" })
  productCollectionId: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => Collection, (collection) => collection.productCollections)
  @JoinColumn([{ name: "CollectionId", referencedColumnName: "collectionId" }])
  collection: Collection;

  @ManyToOne(() => Product, (product) => product.productCollections)
  @JoinColumn([{ name: "ProductId", referencedColumnName: "productId" }])
  product: Product;
}
