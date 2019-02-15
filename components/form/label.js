import { string } from 'prop-types';

const Label = ({ htmlFor, children }) => (
  <label htmlFor={ htmlFor }>
    { children }
  </label>
);

Label.propTypes = {
  htmlFor: string.isRequired,
  children: string.isRequired
};

export default Label;
