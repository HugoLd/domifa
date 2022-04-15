import { TimeZone } from "./../../../util/territoires/types/TimeZone.type";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { domifaConfig } from "../../../config";
import {
  monitoringBatchProcessSimpleCountRunner,
  MonitoringBatchProcessTrigger,
  structureRepository,
} from "../../../database";
import { messageSmsRepository } from "../../../database/services/message-sms";
import { MessageSmsSenderService } from "../message-sms-sender.service";
import { appLogger } from "../../../util";

@Injectable()
export class CronSmsEndDomSenderService {
  constructor(private messageSmsSenderService: MessageSmsSenderService) {}

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send Europe/Paris",
    timeZone: "Europe/Paris",
  })
  protected async sendSmsEurope() {
    await this.sendSmsUsagerEndDom("cron", "Europe/Paris");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send America/Martinique",
    timeZone: "America/Martinique",
  })
  protected async sendSmsMartinique() {
    await this.sendSmsUsagerEndDom("cron", "America/Martinique");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send America/Cayenne",
    timeZone: "America/Cayenne",
  })
  protected async sendSmsCayenne() {
    await this.sendSmsUsagerEndDom("cron", "America/Cayenne");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send Indian/Mayotte",
    timeZone: "Indian/Mayotte",
  })
  protected async sendSmsMayotte() {
    await this.sendSmsUsagerEndDom("cron", "Indian/Mayotte");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send Pacific/Noumea",
    timeZone: "Pacific/Noumea",
  })
  protected async sendSmsNoumea() {
    await this.sendSmsUsagerEndDom("cron", "Pacific/Noumea");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send Pacific/Tahiti",
    timeZone: "Pacific/Tahiti",
  })
  protected async sendSmsTahiti() {
    await this.sendSmsUsagerEndDom("cron", "Pacific/Tahiti");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send America/Miquelon",
    timeZone: "America/Miquelon",
  })
  protected async sendSmsMiquelon() {
    await this.sendSmsUsagerEndDom("cron", "America/Miquelon");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send Indian/Maldives",
    timeZone: "Indian/Maldives",
  })
  protected async sendSmsMaldives() {
    await this.sendSmsUsagerEndDom("cron", "Indian/Maldives");
  }

  @Cron(domifaConfig().cron.smsConsumer.fetchEndDomCronTim, {
    name: "Sms send Indian/Reunion",
    timeZone: "Indian/Reunion",
  })
  protected async sendSmsReunion() {
    await this.sendSmsUsagerEndDom("cron", "Indian/Reunion");
  }

  @Cron(domifaConfig().cron.smsConsumer.sendEndDomCronTim)
  public async sendSmsUsagerEndDom(
    trigger: MonitoringBatchProcessTrigger,
    timeZone: TimeZone
  ) {
    const structureIds = await structureRepository.getStructureIdsWithSms(
      timeZone
    );

    if (!structureIds || structureIds.length === 0) {
      appLogger.warn(
        `[CronSms] [sendSmsUsagerEndDom] No structure with SMS for ${timeZone} at ${new Date().toString()}`
      );
      return;
    }

    // if (!domifaConfig().sms.enabled) {
    //   // Désactiver tous les SMS en attente
    //   appLogger.warn(
    //     `[CronSms] [sendSmsUsagerEndDom] Disable all SMS to Send for  ${timeZone}`
    //   );
    //   return this.messageSmsSenderService.disableAllSmsToSend();
    // }

    await monitoringBatchProcessSimpleCountRunner.monitorProcess(
      {
        processId: "sms-messages-consumer",
        trigger,
      },
      async ({ monitorTotal, monitorSuccess, monitorError }) => {
        const messageSmsList = await messageSmsRepository.findSmsEndDomToSend(
          structureIds
        );

        monitorTotal(messageSmsList.length);

        for (const messageSms of messageSmsList) {
          try {
            await this.messageSmsSenderService.sendSms(messageSms);
            monitorSuccess();
          } catch (err) {
            monitorError(err as Error);
            appLogger.warn(
              `[CronSms] ERROR in sending SMS : ${JSON.stringify(err)}`,
              {
                sentryBreadcrumb: true,
              }
            );
          }
        }
      }
    );
  }
}
