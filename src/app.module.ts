import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./db/typeorm/typeorm.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import * as Joi from "@hapi/joi";
import { getEnvPath } from "./common/utils/utils";
import { CustomerUserModule } from "./controller/customer-user/customer-user.module";
import { StaffAccessModule } from "./controller/staff-access/staff-access.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { StaffUserModule } from "./controller/staff-user/staff-user.module";
import { CategoryModule } from "./controller/category/category.module";
import { CollectionModule } from "./controller/collection/collection.module";
import { ProductModule } from "./controller/product/product.module";
import { ProductCollection } from "./db/entities/ProductCollection";
import { ProductCollectionModule } from "./controller/product-collection/product-collection.module";
import { AIModule } from "./controller/ai/ai.module";
import { GiftAddOnsModule } from "./controller/gift-add-ons/gift-add-ons.module";
import { DiscountsModule } from "./controller/discounts/discounts.module";
import { CartModule } from "./controller/cart/cart.module";
import { OrderService } from "./services/order.service";
import { OrderModule } from "./controller/order/order.module";
import { DeliveryService } from "./services/delivery.service";
import { SystemConfigService } from "./services/system-config.service";
import { SystemConfigModule } from "./controller/system-config/system-config.module";
import { GeolocationModule } from "./controller/geolocation/geolocation.module";
import { GeolocationService } from "./services/geolocation.service";
import { DeliveryModule } from "./controller/delivery/delivery.module";
import { CustomerUserWishListService } from "./services/customer-user-wish-list.service";
import { CustomerUserWishListModule } from "./controller/customer-user-wish-list/customer-user-wish-list.module";
import { EmailModule } from "./controller/email/email.module";

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    FirebaseProviderModule,
    StaffUserModule,
    StaffAccessModule,
    CustomerUserModule,
    CategoryModule,
    CollectionModule,
    ProductModule,
    ProductCollection,
    ProductCollectionModule,
    AIModule,
    GiftAddOnsModule,
    DiscountsModule,
    CartModule,
    OrderModule,
    SystemConfigModule,
    GeolocationModule,
    DeliveryModule,
    CustomerUserWishListModule,
    EmailModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
