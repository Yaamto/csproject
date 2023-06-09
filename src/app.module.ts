import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity'
import { APP_PIPE } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { SpaceModule } from './space/space.module';
import { Space } from './space/entities/space.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { UtilityModule } from './utility/utility.module';
import { Utility } from './utility/entities/utility.entity';
import { MapModule } from './map/map.module';
import { Map } from './map/entities/map.entity';
import { PaymentModule } from './payment/payment.module';
import { StripeModule } from 'nestjs-stripe';
const  cookieSession = require('cookie-session');

@Module({
  imports: [
    MulterModule.register({ dest: '../uploads' }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    StripeModule.forRoot({
      apiKey: `${process.env.STRIPE_SECRET}`,
      apiVersion: '2022-11-15',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: +config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Space, Category, Utility, Map],
        synchronize: true,
      })
    }),
    UserModule,
    SpaceModule,
    CategoryModule,
    UtilityModule,
    MapModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
        keys: ['NB3BJ21H3BV23I8VHF9JEJF98YFEY7TF55V5'],
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
      }))
      .forRoutes('*')
  }
}
