import type {Page} from '@playwright/test';
import {expect} from "@playwright/test";
import {addDays, format} from 'date-fns';

const HOME_PAGE_URL = 'https://automationintesting.online';

export class HomePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getTestBanner() {
    return this.page.locator('div#collapseBanner');
  }

  private getLetMeHackButton() {
    return this.page.locator('#collapseBanner .btn-primary');
  }

  private getTitleImage() {
    return this.page.locator('.container-fluid .hotel-logoUrl')
  }

  private getWheelChairIcon() {
    return this.page.locator('.fa-wheelchair').nth(0);
  }

  private getBookThisRoomButton() {
    return this.page.locator('button.openBooking').nth(0);
  }

  private getFirstnameField() {
    return this.page.locator('[aria-label="Firstname"]');
  }

  private getLastnameField() {
    return this.page.locator('[aria-label="Lastname"]');
  }

  private getEmailField() {
    // This should be fixed on frontend, violates aria label uniqueness for screen readers
    return this.page.locator('[aria-label="Email"].room-email');
  }

  private getPhoneField() {
    // This should be fixed on frontend, violates aria label uniqueness for screen readers
    return this.page.locator('[aria-label="Phone"].room-phone');
  }

  private getCalendar() {
    return this.page.locator('.hotel-room-info .rbc-calendar');
  }

  private getTodaysDate() {
    return this.page.locator('[aria-label="Month View"] .rbc-today');
  }

  private getFutureDate(day: number) {
    return this.page.locator(`[aria-label="Month View"] .rbc-button-link:has-text("${day}")`).nth(-1);
  }

  private getBookButton() {
    return this.page.locator('button.book-room.btn-outline-primary');
  }

  private getConfirmationTitle() {
    return this.page.locator('.confirmation-modal h3');
  }

  private getConfirmationText() {
    return this.page.locator('.confirmation-modal p').nth(0);
  }

  private getConfirmationDates() {
    return this.page.locator('.confirmation-modal p').nth(1);
  }

  private async isRoomDisabled(): Promise<boolean> {
    try {
      await this.getWheelChairIcon().waitFor({state: 'visible', timeout: 5000});
      return true;
    } catch (e) {
      return false;
    }
  }

  private async selectDates(endDay: number) {
    // This will break for months which finish on the last day in the box as the ui does not support dragging to another month\
    // Needs to be fixed in the ui
    await this.getCalendar().scrollIntoViewIfNeeded();
    const fromBound = await this.getTodaysDate().boundingBox();
    const toBound = await this.getFutureDate(endDay).boundingBox();
    await this.page.mouse.move(fromBound.x, fromBound.y + fromBound.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(toBound.x + toBound.width / 2, toBound.y + toBound.height / 2, {steps: 3});
    await this.page.mouse.up();
  }

  async navigate() {
    this.page.goto(HOME_PAGE_URL);
    await this.getTitleImage().waitFor({state: 'visible'});
    await this.getLetMeHackButton().click();
    await this.getTestBanner().waitFor({state: 'hidden'})
  }

  async bookAndConfirmRoom(firstName: string, lastname: string, email: string, phone: string, nights: number, accessible: boolean) {
    if (accessible) {
      await expect(await this.isRoomDisabled(), 'Unable to book the room as it is not disabled friendly').toBeTruthy();
    }

    await this.getBookThisRoomButton().click();

    await this.getFirstnameField().fill(firstName);
    await this.getLastnameField().fill(lastname);
    await this.getEmailField().fill(email);
    await this.getPhoneField().fill(phone);

    const today = new Date();
    const endDate = addDays(today, nights);

    await this.selectDates(endDate.getDate());

    await this.getBookButton().click();

    await expect(this.getConfirmationTitle()).toHaveText('Booking Successful!');
    await expect(this.getConfirmationText()).toHaveText('Congratulations! Your booking has been confirmed for:');
    // test fails as booking date incorrect
    await expect(this.getConfirmationDates()).toContainText(format(today, 'yyyy-MM-dd') + ' - ' + format(endDate, 'yyyy-MM-dd'));
  }
}
