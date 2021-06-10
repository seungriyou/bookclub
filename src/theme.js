const colors = {
  white: '#ffffff',
  black: '#000000',
  grey_0: '#d5d5d5',
  grey_1: '#a6a6a6',
  grey_2: '#ededed',
  red: '#e84118',
  blue: '#3679fe',
  pastel_pink: '#fac8af',
};

export const theme = {
  background: colors.white,
  text: colors.black,
  errorText: colors.red,

  imageBackground: colors.grey_0,
  imageButtonBackground: colors.grey_1,
  imageButtonIcon: colors.white,

  label: colors.grey_1, //포커스기능이 있는 입력창 색깔
  inputPlaceholder: colors.grey_1,
  inputBorder: colors.grey_1,
  inputDisabledBackground: colors.grey_0,

  buttonBackground: colors.pastel_pink, //버튼 색깔
  buttonTitle: colors.white,
  buttonUnfilledTitle: colors.pastel_pink,
  buttonLogout: colors.red,
  headerTintColor: colors.black,
  tabActiveColor: colors.pastel_pink,
  tabInactiveColor: colors.grey_1,

  spinnerBackground: colors.black,
  spinnerIndicator: colors.white,

  listBorder: colors.grey_0,
  listTime: colors.grey_1,
  listDescription: colors.grey_1,
  listIcon: colors.black,

  // MyClubAlbum 관련 추가
  appBackground: colors.pastel_pink,
  inputBackground: colors.white,
  buttonIcon: colors.black,
  separator: colors.grey_0,
  infoText: colors.black,
  infoTextComment: colors.grey_1,
  
  // MyClubBoardView 관련 추가 
  line: colors.grey_0,

  // SearchForm 관련 추가
  search: colors.grey_2,
};
