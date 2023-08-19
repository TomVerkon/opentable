const renderTitle = (slug: string) => {
  let retval = '';
  if (slug) {
    const slugArray = slug.split('-');
    slugArray[slugArray.length - 1] = `(${slugArray[slugArray.length - 1]})`;
    retval = slugArray.join(' ');
  }
  return retval;
};

export default renderTitle;
