// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
// workaround: https://github.com/testing-library/jest-dom/issues/427#issuecomment-1110985202
import '@testing-library/jest-dom/extend-expect';