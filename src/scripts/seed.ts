import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { CyclesService } from '../modules/cycles/cycles.service';
import { DailyLogsService } from '../modules/daily-logs/daily-logs.service';
import { ActivitiesService } from '../modules/activities/activities.service';
import { PregnancyTestsService } from '../modules/pregnancy-tests/pregnancy-tests.service';
import { TipsService } from '../modules/tips/tips.service';
import { ArticlesService } from '../modules/articles/articles.service';
import { CycleStatus } from '../modules/cycles/schemas/cycle.schema';
import { PregnancyTestResult } from '../modules/pregnancy-tests/schemas/pregnancy-test-log.schema';
import { CyclePhase } from '../modules/tips/schemas/tip.schema';
import { UserDocument } from '../modules/users/schemas/user.schema';
import { CycleDocument } from '../modules/cycles/schemas/cycle.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const cyclesService = app.get(CyclesService);
  const dailyLogsService = app.get(DailyLogsService);
  const activitiesService = app.get(ActivitiesService);
  const pregnancyTestsService = app.get(PregnancyTestsService);
  const tipsService = app.get(TipsService);
  const articlesService = app.get(ArticlesService);

  console.log('Starting seed...');

  // Create sample user
  const user = await usersService.create({
    name: 'Emmanuelle',
    email: 'emmanuelle@example.com',
    profilePicture: 'https://via.placeholder.com/150',
    averageCycleLength: 28,
  });
  const userDoc = user as unknown as UserDocument;
  console.log('Created user:', String(userDoc._id));

  // Create sample cycle
  const periodStartDate = new Date();
  periodStartDate.setDate(periodStartDate.getDate() - 20);
  const userId = String(userDoc._id);
  const cycle = await cyclesService.create({
    userId: userId,
    startDate: periodStartDate,
    periodStartDate: periodStartDate,
    periodEndDate: new Date(periodStartDate.getTime() + 5 * 24 * 60 * 60 * 1000),
    cycleLength: 28,
  });
  const cycleDoc = cycle as unknown as CycleDocument;
  console.log('Created cycle:', String(cycleDoc._id));

  // Create sample daily logs
  for (let i = 0; i < 10; i++) {
    const logDate = new Date();
    logDate.setDate(logDate.getDate() - i);
    
    await dailyLogsService.create({
      userId: userId,
      date: logDate,
      cycleDay: 21 - i,
      physicalPainSymptoms: i % 3 === 0 ? ['Bloating', 'Cramps'] : ['Headache'],
      moodMentalStates: i % 2 === 0 ? ['Happy'] : ['Mood swings', 'Cravings'],
      flowIntensity: i < 3 ? 5 + i : 0,
      periodIndicators: i < 3 ? ['Spotting'] : [],
      sexualHealthIndicators: [],
      notes: i === 0 ? 'After lunch...' : undefined,
    });
  }
  console.log('Created daily logs');

  // Create sample activities
  await activitiesService.create({
    userId: userId,
    date: new Date(),
    activityName: 'Pilates',
    duration: 30,
    notes: 'Logged',
  });
  console.log('Created activities');

  // Create sample pregnancy test
  await pregnancyTestsService.create({
    userId: userId,
    date: new Date(),
    result: PregnancyTestResult.NOT_TAKEN,
  });
  console.log('Created pregnancy test');

  // Create sample tips
  await tipsService.create({
    title: 'Day 1 Tip',
    content: 'Understand your cycle and take care during peak days.',
    category: 'general',
    cycleDay: 1,
  });

  await tipsService.create({
    title: 'Stay Comfortable',
    content:
      'On heavy flow days, prioritize comfort. Stay hydrated and use heating pads for abdominal relief.',
    category: 'comfort',
    cyclePhase: CyclePhase.MENSTRUAL,
  });

  await tipsService.create({
    title: 'Gentle Movement',
    content: 'Light stretches ease discomfort.',
    category: 'movement',
    cyclePhase: CyclePhase.MENSTRUAL,
  });

  await tipsService.create({
    title: 'Hydration Tip',
    content: 'Drink enough water for your health and your body. -8 glasses daily',
    category: 'hydration',
  });
  console.log('Created tips');

  // Create sample articles
  await articlesService.create({
    title: '5 Ways to Reduce Stress During Your Cycle',
    content:
      'Learn effective strategies to manage stress and maintain balance throughout your menstrual cycle.',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'stress',
    publishedAt: new Date(),
  });

  await articlesService.create({
    title: 'Best Nutrition Tips for Better Energy',
    content:
      'Discover how proper nutrition can boost your energy levels and support your overall health.',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'nutrition',
    publishedAt: new Date(),
  });

  await articlesService.create({
    title: 'How Sleep Affects Hormonal Balance',
    content:
      'Understanding the connection between sleep patterns and hormonal health.',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'sleep',
    publishedAt: new Date(),
  });
  console.log('Created articles');

  console.log('Seed completed successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

