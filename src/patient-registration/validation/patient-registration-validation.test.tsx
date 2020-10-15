import React from 'react';
import { render, fireEvent, wait, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import dayjs from 'dayjs';
import { validationSchema } from './patient-registration-validation';
import { NameInput } from './../input/custom-input/name/name-input.component';
import { SelectInput } from '../input/basic-input/select/select-input.component';
import { EstimatedAgeInput } from './../input/custom-input/estimated-age/estimated-age-input.component';
import { Input } from '../input/basic-input/input/input.component';
import { queryByLabelText } from '@testing-library/dom';

describe('name input', () => {
  const testValidName = (givenNameValue: string, middleNameValue: string, familyNameValue: string) => {
    it(
      'does not display error message when givenNameValue: ' +
        givenNameValue +
        ', middleNameValue: ' +
        middleNameValue +
        ', familyNameValue: ' +
        familyNameValue,
      async () => {
        const error = await updateNameAndReturnError(givenNameValue, middleNameValue, familyNameValue);
        Object.values(error).map(currentError => expect(currentError).toBeNull());
      },
    );
  };

  const testInvalidName = (
    givenNameValue: string,
    middleNameValue: string,
    familyNameValue: string,
    expectedError: string,
    errorType: string,
  ) => {
    it(
      'displays error message when givenNameValue: ' +
        givenNameValue +
        ', middleNameValue: ' +
        middleNameValue +
        ', familyNameValue: ' +
        familyNameValue,
      async () => {
        const error = (await updateNameAndReturnError(givenNameValue, middleNameValue, familyNameValue))[errorType];
        expect(error.textContent).toEqual(expectedError);
      },
    );
  };

  const updateNameAndReturnError = async (givenNameValue: string, middleNameValue: string, familyNameValue: string) => {
    render(
      <Formik
        initialValues={{
          givenName: '',
          middleName: '',
          familyName: '',
        }}
        onSubmit={null}
        validationSchema={validationSchema}>
        <Form>
          <NameInput
            givenName="givenName"
            middleName="middleName"
            familyName="familyName"
            showRequiredAsterisk={true}
          />
        </Form>
      </Formik>,
    );
    const givenNameInput = screen.getByLabelText('givenName') as HTMLInputElement;
    const middleNameInput = screen.getByLabelText('middleName') as HTMLInputElement;
    const familyNameInput = screen.getByLabelText('familyName') as HTMLInputElement;

    fireEvent.change(givenNameInput, { target: { value: givenNameValue } });
    fireEvent.blur(givenNameInput);
    fireEvent.change(middleNameInput, { target: { value: middleNameValue } });
    fireEvent.blur(middleNameInput);
    fireEvent.change(familyNameInput, { target: { value: familyNameValue } });
    fireEvent.blur(familyNameInput);

    await wait();

    return {
      givenNameError: screen.queryByLabelText(/givenNameError/),
      middleNameError: screen.queryByLabelText(/middleNameError/),
      familyNameError: screen.queryByLabelText(/familyNameError/),
    };
  };

  testValidName('Aaron', 'A', 'Aaronson');
  testValidName('No', '', 'Middle Name');
  testInvalidName('', '', '', 'Given name is required', 'givenNameError');
  testInvalidName('', '', '', 'Family name is required', 'familyNameError');
  testInvalidName('', 'No', 'Given Name', 'Given name is required', 'givenNameError');
  testInvalidName('No', 'Family Name', '', 'Family name is required', 'familyNameError');
});

describe('additional name input', () => {
  const testValidAdditionalName = (
    givenNameValue: string,
    middleNameValue: string,
    familyNameValue: string,
    addNameInLocalLanguage: boolean,
  ) => {
    it(
      'does not display error message when givenNameValue: ' +
        givenNameValue +
        ', middleNameValue: ' +
        middleNameValue +
        ', familyNameValue: ' +
        familyNameValue +
        ', addNameInLocalLanguage: ' +
        addNameInLocalLanguage,
      async () => {
        const error = await updateNameAndReturnError(
          givenNameValue,
          middleNameValue,
          familyNameValue,
          addNameInLocalLanguage,
        );
        Object.values(error).map(currentError => expect(currentError).toBeNull());
      },
    );
  };

  const testInvalidAdditionalName = (
    givenNameValue: string,
    middleNameValue: string,
    familyNameValue: string,
    expectedError: string,
    errorType: string,
  ) => {
    it(
      'displays error message when givenNameValue: ' +
        givenNameValue +
        ', middleNameValue: ' +
        middleNameValue +
        ', familyNameValue: ' +
        familyNameValue +
        ', addNameInLocalLanguage: true',
      async () => {
        const error = (await updateNameAndReturnError(givenNameValue, middleNameValue, familyNameValue, true))[
          errorType
        ];
        expect(error.textContent).toEqual(expectedError);
      },
    );
  };

  const updateNameAndReturnError = async (
    givenNameValue: string,
    middleNameValue: string,
    familyNameValue: string,
    addNameInLocalLanguage: boolean,
  ) => {
    render(
      <Formik
        initialValues={{
          additionalGivenName: '',
          additionalMiddleName: '',
          additionalFamilyName: '',
          addNameInLocalLanguage,
        }}
        onSubmit={null}
        validationSchema={validationSchema}>
        <Form>
          <NameInput
            givenName="additionalGivenName"
            middleName="additionalMiddleName"
            familyName="additionalFamilyName"
            showRequiredAsterisk={true}
          />
          <Input type="checkbox" label="Add name" name="addNameInLocalLanguage" />
        </Form>
      </Formik>,
    );
    const givenNameInput = screen.getByLabelText('additionalGivenName') as HTMLInputElement;
    const middleNameInput = screen.getByLabelText('additionalMiddleName') as HTMLInputElement;
    const familyNameInput = screen.getByLabelText('additionalFamilyName') as HTMLInputElement;

    fireEvent.change(givenNameInput, { target: { value: givenNameValue } });
    fireEvent.blur(givenNameInput);
    fireEvent.change(middleNameInput, { target: { value: middleNameValue } });
    fireEvent.blur(middleNameInput);
    fireEvent.change(familyNameInput, { target: { value: familyNameValue } });
    fireEvent.blur(familyNameInput);

    await wait();

    return {
      givenNameError: screen.queryByLabelText(/additionalGivenNameError/),
      middleNameError: screen.queryByLabelText(/additionalMiddleNameError/),
      familyNameError: screen.queryByLabelText(/additionalFamilyNameError/),
    };
  };

  testValidAdditionalName('Aaron', 'A', 'Aaronson', true);
  testValidAdditionalName('No', '', 'Middle Name', true);
  testValidAdditionalName('', '', '', false);
  testInvalidAdditionalName('', '', '', 'Given name is required', 'givenNameError');
  testInvalidAdditionalName('', '', '', 'Family name is required', 'familyNameError');
  testInvalidAdditionalName('', 'No', 'Given Name', 'Given name is required', 'givenNameError');
  testInvalidAdditionalName('No', 'Family Name', '', 'Family name is required', 'familyNameError');
});

describe('gender input', () => {
  const testValidGender = (validGender: string) => {
    it('does not display error message when ' + validGender + ' is inputted', async () => {
      const error = await updateGenderAndReturnError(validGender);
      expect(error).toBeNull();
    });
  };

  const testInvalidGender = (invalidGender: string, expectedError: string) => {
    it('displays error message when ' + invalidGender + ' is inputted', async () => {
      const error = await updateGenderAndReturnError(invalidGender);
      expect(error.textContent).toEqual(expectedError);
    });
  };

  const updateGenderAndReturnError = async (gender: string) => {
    render(
      <Formik initialValues={{ gender: '' }} onSubmit={null} validationSchema={validationSchema}>
        <Form>
          <SelectInput
            name="gender"
            options={['Male', 'Female', 'Other', 'Unknown']}
            label="Gender"
            showRequiredAsterisk={true}
          />
        </Form>
      </Formik>,
    );
    const input = screen.getByLabelText('gender') as HTMLSelectElement;

    fireEvent.change(input, { target: { value: gender } });
    fireEvent.blur(input);

    await wait();

    return screen.queryByLabelText(/genderError/);
  };

  testValidGender('Male');
  testValidGender('Female');
  testValidGender('Other');
  testValidGender('Unknown');
  testInvalidGender('', 'Gender is required');
});

describe('birthdate input', () => {
  const testValidBirthdate = (validBirthdate: string) => {
    it('does not display error message when ' + validBirthdate + ' is inputted', async () => {
      const error = await updateBirthdateAndReturnError(validBirthdate);
      expect(error).toBeNull();
    });
  };

  const testInvalidBirthdate = (invalidBirthdate: string, expectedError: string) => {
    it('displays error message when ' + invalidBirthdate + ' is inputted', async () => {
      const error = await updateBirthdateAndReturnError(invalidBirthdate);
      expect(error.textContent).toEqual(expectedError);
    });
  };

  const updateBirthdateAndReturnError = async (birthdate: string) => {
    render(
      <Formik initialValues={{ birthdate: null }} onSubmit={null} validationSchema={validationSchema}>
        <Form>
          <Input type="date" label="Date of Birth" name="birthdate" showRequiredAsterisk={true} />
        </Form>
      </Formik>,
    );
    const input = screen.getByLabelText('birthdate') as HTMLInputElement;

    fireEvent.change(input, { target: { value: birthdate } });
    fireEvent.blur(input);

    await wait();

    return screen.queryByLabelText(/birthdateError/);
  };

  testValidBirthdate('1990-09-10');
  testValidBirthdate(
    dayjs()
      .subtract(1, 'day')
      .format('YYYY-MM-DD'),
  );
  testValidBirthdate(dayjs().format('YYYY-MM-DD'));
  testInvalidBirthdate(
    dayjs()
      .add(1, 'day')
      .format('YYYY-MM-DD'),
    'Birthdate cannot be in the future',
  );
  testInvalidBirthdate(null, 'Birthdate is required');
});

describe('estimated age input', () => {
  const testValidEstimatedAge = (validEstimatedAge: { years: number; months: number }) => {
    it('does not display error message when ' + validEstimatedAge + ' is inputted', async () => {
      const error = await updateEstimatedAgeAndReturnError(validEstimatedAge);
      expect(error.yearsEstimatedError).toBeNull();
      expect(error.monthsEstimatedError).toBeNull();
    });
  };

  const testInvalidEstimatedYears = (invalidEstimatedAge: { years: number; months: number }, expectedError: string) => {
    it('displays error message when ' + invalidEstimatedAge + ' is inputted', async () => {
      const error = await updateEstimatedAgeAndReturnError(invalidEstimatedAge);
      expect(error.yearsEstimatedError.textContent).toEqual(expectedError);
    });
  };

  const testInvalidEstimatedMonths = (
    invalidEstimatedAge: { years: number; months: number },
    expectedError: string,
  ) => {
    it('displays error message when ' + invalidEstimatedAge + ' is inputted', async () => {
      const error = await updateEstimatedAgeAndReturnError(invalidEstimatedAge);
      expect(error.monthsEstimatedError.textContent).toEqual(expectedError);
    });
  };

  const updateEstimatedAgeAndReturnError = async (estimatedAge: { years: number; months: number }) => {
    render(
      <Formik
        initialValues={{ yearsEstimated: 0, monthsEstimated: 0 }}
        onSubmit={null}
        validationSchema={validationSchema}>
        <Form>
          <EstimatedAgeInput yearsName="yearsEstimated" monthsName="monthsEstimated" setBirthdate={() => {}} />
        </Form>
      </Formik>,
    );
    const yearsEstimatedInput = screen.getByLabelText('yearsEstimated') as HTMLInputElement;
    const monthsEstimatedInput = screen.getByLabelText('monthsEstimated') as HTMLInputElement;

    fireEvent.change(yearsEstimatedInput, { target: { value: estimatedAge.years } });
    fireEvent.blur(yearsEstimatedInput);
    fireEvent.change(monthsEstimatedInput, { target: { value: estimatedAge.months } });
    fireEvent.blur(monthsEstimatedInput);

    await wait();

    return {
      yearsEstimatedError: screen.queryByLabelText(/yearsEstimatedError/),
      monthsEstimatedError: screen.queryByLabelText(/monthsEstimatedError/),
    };
  };

  testValidEstimatedAge({
    years: 30,
    months: 1,
  });
  testInvalidEstimatedYears(
    {
      years: -10,
      months: 2,
    },
    'Years cannot be less than 0',
  );
  testInvalidEstimatedMonths(
    {
      years: 20,
      months: -10,
    },
    'Months cannot be less than 0',
  );
});

describe('date of death input', () => {
  const testValidDeathDate = (validDeathDate: string) => {
    it('does not display error message when ' + validDeathDate + ' is inputted', async () => {
      const error = await updateDeathDateAndReturnError(validDeathDate);
      expect(error).toBeNull();
    });
  };

  const testInvalidDeathDate = (invalidDeathDate: string, expectedError: string) => {
    it('displays error message when ' + invalidDeathDate + ' is inputted', async () => {
      const error = await updateDeathDateAndReturnError(invalidDeathDate);
      expect(error.textContent).toEqual(expectedError);
    });
  };

  const updateDeathDateAndReturnError = async (deathDate: string) => {
    render(
      <Formik initialValues={{ deathDate: null }} onSubmit={null} validationSchema={validationSchema}>
        <Form>
          <Input type="date" label="Date of Death" name="deathDate" />
        </Form>
      </Formik>,
    );
    const input = screen.getByLabelText('deathDate') as HTMLInputElement;

    fireEvent.change(input, { target: { value: deathDate } });
    fireEvent.blur(input);

    await wait();

    return screen.queryByLabelText(/deathDateError/);
  };

  testValidDeathDate('2020-01-01');
  testValidDeathDate(
    dayjs()
      .subtract(1, 'day')
      .format('YYYY-MM-DD'),
  );
  testValidDeathDate(dayjs().format('YYYY-MM-DD'));
  testInvalidDeathDate(
    dayjs()
      .add(1, 'day')
      .format('YYYY-MM-DD'),
    'Date of Death cannot be in the future',
  );
});
