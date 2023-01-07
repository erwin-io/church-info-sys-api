import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./controller/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { getEnvPath } from "./common/helper/env.helper";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import { RolesModule } from "./controller/roles/roles.module";
import { FileModule } from "./controller/file/file.module";
import { MessageModule } from "./controller/message/message.module";
import { DashboardModule } from "./controller/dashboard/dashboard.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { SchedulerModule } from "./controller/scheduler/scheduler.module";
import { ReminderModule } from "./controller/reminder/reminder.module";
import * as Joi from "@hapi/joi";
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
    UsersModule,
    RolesModule,
    FileModule,
    MessageModule,
    MessageModule,
    DashboardModule,
    FirebaseProviderModule,
    SchedulerModule,
    ReminderModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
