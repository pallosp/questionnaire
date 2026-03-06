const config = {
  transform: {
    '\\.tsx?$': '@swc/jest',
  },
  resolver: 'jest-resolver-tsconfig-paths',
};

export default config;
