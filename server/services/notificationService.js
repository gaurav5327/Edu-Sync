// server/services/notificationService.js
class NotificationService {
  constructor() {
    this.channels = new Map();
    this.templates = new Map();
    this.setupChannels();
    this.setupTemplates();
  }

  setupChannels() {
    // Email channel
    this.channels.set('email', new EmailChannel());
    
    // SMS channel
    this.channels.set('sms', new SMSChannel());
    
    // Push notification channel
    this.channels.set('push', new PushNotificationChannel());
    
    // In-app notification channel
    this.channels.set('inapp', new InAppNotificationChannel());
  }

  async sendNotification(notification) {
    const { recipients, channels, template, data } = notification;
    
    const templateContent = this.templates.get(template);
    if (!templateContent) {
      throw new Error(`Template ${template} not found`);
    }

    const promises = channels.map(channelName => {
      const channel = this.channels.get(channelName);
      if (!channel) {
        throw new Error(`Channel ${channelName} not found`);
      }

      return channel.send({
        recipients,
        subject: this.renderTemplate(templateContent.subject, data),
        body: this.renderTemplate(templateContent.body, data),
        data
      });
    });

    await Promise.all(promises);
  }

  async scheduleChangeNotification(scheduleId, changes) {
    const schedule = await Schedule.findById(scheduleId)
      .populate('timetable.course.instructor')
      .populate('timetable.room');

    const affectedUsers = await this.getAffectedUsers(schedule, changes);

    for (const user of affectedUsers) {
      await this.sendNotification({
        recipients: [user.email],
        channels: ['email', 'inapp'],
        template: 'schedule_change',
        data: {
          userName: user.name,
          scheduleName: `${schedule.year} ${schedule.branch} ${schedule.division}`,
          changes: changes,
          newSchedule: schedule
        }
      });
    }
  }
}