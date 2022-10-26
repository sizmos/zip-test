import {test} from '@playwright/test';
import {HomePage} from "../../pages/home.page";

const testcase = {
  testName: 'Book and confirm an accessible room for 2 nights',
  firstName: 'Anna',
  lastName: 'Smith',
  email: 'asmith@fjklsdflkdsdf.com',
  phone: '042343243423254433',
  nights: 2,
  accessible: true,
};

test(testcase.testName, async ({page}) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await homePage.bookAndConfirmRoom(testcase.firstName, testcase.lastName, testcase.email, testcase.phone, testcase.nights, testcase.accessible);
  console.log('');
});
