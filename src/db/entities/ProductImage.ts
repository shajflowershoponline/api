import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { File } from "./File";
import { Product } from "./Product";

@Index("ProductImage_pkey", ["productImageId"], { unique: true })
@Entity("ProductImage", { schema: "dbo" })
export class ProductImage {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ProductImageId" })
  productImageId: string;

  @Column("numeric", { name: "SequenceId" })
  sequenceId: string;

  @ManyToOne(() => File, (file) => file.productImages)
  @JoinColumn([{ name: "FileId", referencedColumnName: "fileId" }])
  file: File;

  @ManyToOne(() => Product, (product) => product.productImages)
  @JoinColumn([{ name: "ProductId", referencedColumnName: "productId" }])
  product: Product;
}
