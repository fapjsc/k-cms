export const filterTitle = ({ object, masterType, tel }) => {
  let arr = [];

  if (tel && !masterType) {
    arr = Object.values(object).filter((el) => {
      return el.tel?.some((r) => tel?.includes(r.toString()));
    });
  }

  if (!tel && masterType) {
    arr = Object.values(object).filter((el) => {
      return el.masterType?.some((r) => masterType?.includes(r.toString()));
    });
  }

  if (tel && masterType) {
    arr = Object.values(object).filter((el) => {
      return (
        el.masterType?.some((r) => masterType?.includes(r.toString())) &&
        el.tel?.some((r) => tel?.includes(r.toString()))
      );
    });
  }

  return arr;
};

export const filterPhone = ({ phoneObj, filerTitle, filterType }) => {
  let phoneArr = [];
  if (filerTitle && !filterType) {
    phoneArr = Object.values(phoneObj).filter((el) =>
      el.title?.some((r) => filerTitle?.includes(r))
    );
  }

  if (!filerTitle && filterType) {
    phoneArr = Object.values(phoneObj).filter((el) => {
      return el.masterType.some((r) => filterType?.includes(r));
    });
  }

  if (filerTitle && filterType) {
    phoneArr = Object.values(phoneObj).filter((el) => {
      return (
        el.title.some((r) => filerTitle?.includes(r)) &&
        el.masterType.some((r) => filterType?.includes(r))
      );
    });
  }

  return phoneArr;
};

export const filterMasterType = ({ masterTypeObj, filerTitle, filterTel }) => {
  let typeArr = [];

  if (filterTel && !filerTitle) {
    typeArr = Object.values(masterTypeObj).filter((el) => {
      return el.tel.some((r) => filterTel?.includes(r.toString()));
    });
  }

  if (!filterTel && filerTitle) {
    typeArr = Object.values(masterTypeObj).filter((el) => {
      return el.title.some((r) => filerTitle?.includes(r));
    });
  }

  if (filterTel && filerTitle) {
    typeArr = Object.values(masterTypeObj).filter((el) => {
      return (
        el.title.some((r) => filerTitle.includes(r)) &&
        el.tel.some((r) => filterTel?.includes(r.toString()))
      );
    });
  }

  return typeArr;
};

export const filterStatistics = ({
  data,
  filerTitle,
  filterTel,
  filterType,
}) => {
  if (!filerTitle?.length) filerTitle = null;
  if (!filterTel?.length) filterTel = null;
  if (!filterType?.length) filterType = null;

  // 000
  if (!filerTitle && !filterTel && !filterType) return data;

  // 111
  if (filerTitle && filterTel && filterType) {
    data = data.filter(
      (el) =>
        filterTel.includes(el.User_Tel.toString()) &&
        filerTitle.includes(el.Title) &&
        filterType.includes(el.Order_MasterTypeID.toString())
    );
  }

  // 100
  if (filerTitle && !filterTel && !filterType) {
    data = data.filter((el) => filerTitle.includes(el.Title));
  }

  // 010
  if (!filerTitle && filterTel && !filterType) {
    data = data.filter((el) => filterTel.includes(el.User_Tel.toString()));
  }

  // 001
  if (!filerTitle && !filterTel && filterType) {
    data = data.filter((el) =>
      filterType.includes(el.Order_MasterTypeID.toString())
    );
    console.log(filerTitle, filterTel, filterType);
    console.log(data);
  }

  // 110
  if (filerTitle && filterTel && !filterType) {
    data = data.filter(
      (el) =>
        filterTel.includes(el.User_Tel.toString()) &&
        filerTitle.includes(el.Title)
    );
  }

  // 101
  if (filerTitle && !filterTel && filterType) {
    data = data.filter(
      (el) =>
        filerTitle.includes(el.Title) &&
        filterType.includes(el.Order_MasterTypeID.toString())
    );
  }

  // 011
  if (!filerTitle && filterTel && filterType) {
    data = data.filter(
      (el) =>
        filterTel.includes(el.User_Tel.toString()) &&
        filterType.includes(el.Order_MasterTypeID.toString())
    );
  }

  return data;
};
