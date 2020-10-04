const parsePropsToQueryOptions = (props) => {
  return {
    search: props.search ? new RegExp(props.search, 'i') : null,
    limit: props.perPage || null,
    skip:
      (props.currentPage && props.perPage && props.currentPage * props.perPage - props.perPage) ||
      null,
    sort: props.sort || null,
    fields: props.fields || null,
  };
};

export default parsePropsToQueryOptions;
