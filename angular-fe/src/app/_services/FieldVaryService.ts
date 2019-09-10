
const requestMap = {
  tags: ['fieldArticleTags', 'fieldNewsTags', 'fieldTag'],
  accordion: ['fieldNewsAccordion', 'fieldInfosystemAccordion'],
  shortDescription: ['fieldShortDescription'],
  image: ['fieldIntroductionImage'],
  duration: ['fieldDuration'],
  title: ['entityLabel', 'FieldSchoolName'],
  head: ['fieldStudyProgrammeLevel', 'FieldEducationalInstitutionTy'],
  educationalInstitution: ['fieldEducationalInstitution'],
  address: ['fieldAddress', 'FieldAddress'],
  teachingLanguage: ['fieldTeachingLanguage'],
  phone: ['FieldSchoolContactPhone'],
  email: ['FieldSchoolContactEmail'],
  webpage: ['FieldSchoolWebpageAddress'],
  url: ['entityUrl'],
  subtitle: ['fieldSubtitle'],
};

export default(data) => {
  const tmp = {};
  Object.keys(data).forEach((item) => {
    Object.keys(requestMap).forEach((compare) => {
      if (requestMap[compare].indexOf(item) !== -1) {
        tmp[compare] = data[item];
      }else {
        tmp[item] = data[item];
      }
    });
  });
  return tmp;
};
