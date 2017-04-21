import { Platform, StyleSheet } from 'react-native';

import theme from './theme';

export default {

  base: {
    flex: 1,
    backgroundColor: theme.base.backgroundColor
  },

  statusBar: {
    style: 'light-content',
    backgroundColor: theme.base.backgroundColor
  },
    messageStatusBar: {
      style: 'default'
    },

  container: {
    flex: 1,
    backgroundColor: theme.main.backgroundColor
  },

  scene: {
    backgroundColor: theme.main.backgroundColor,
    paddingHorizontal: 0
  },

  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.base.overlayColor,
  },
  messageWindow: {
    minHeight: 100,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.main.backgroundColor,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 5
  },
  messageText: {
    color: theme.base.backgroundColor,
    backgroundColor: theme.main.overlayColor
  },
  messageProgressContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageProgressImage: {
    width: 70,
    height: 70,
    opacity: 0.5
  },

  header: {
    backgroundColor: theme.emphasis.backgroundColor,
    color: theme.emphasis.foregroundColor
  },
  homeButton: {
    width: 30,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    lineHeight: 30,
    color: theme.base.foregroundColor,
    fontWeight: 'bold',
    fontSize: 26,
  },
  backButtonImage: {
    width: 30,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.main.decorationColor,
    ...Platform.select({
      android: {
        backgroundColor: theme.emphasis.backgroundColor
      },
    })
  },
  navigationBar: {
    marginTop: 0
  },
    navigationBarNoStatus: {
      marginTop: 20
    },

  menu: {
    flex: 1,
    backgroundColor: theme.base.backgroundColor,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    ...Platform.select({
      android: {
        paddingTop: 0
      }
    })
  },
    menuLandscape: {
      paddingTop: 0
    },
  menuList: {
    flexGrow: 1
  },
  menuMeta: {
    height: 45
  },
  menuButton: {
    width: 30,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
    menuProfileButton: {
      width: 25,
      height: 25,
      marginRight: 10,
    },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
    menuContainerSpread: {
      justifyContent: 'space-between'
    },
  menuItem: {
    flex: 1,
    height: 50,
    lineHeight: 50,
  },
  menuItemIconless: {
    paddingLeft: 38
  },
  menuItemText: {
    color: theme.base.foregroundColor,
    fontWeight: 'bold',
    ...Platform.select({
      android: {
        lineHeight: 31
      },
    })
  },
  menuProfileImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.tonedDown.foregroundColor,
    ...Platform.select({
      android: {
        backgroundColor: theme.base.backgroundColor
      },
    })
  },

  menuProfileStatSingle: {
    flex: 0,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.tonedDown.foregroundColor
  },
  menuProfileStatSingleText: {
    paddingRight: 3,
    paddingBottom: 1,
    paddingLeft: 2,
    lineHeight: 16,
    fontSize: 10,
    color: theme.tonedDown.foregroundColor
  },

  menuProfileStats: {
    flex: 0,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.tonedDown.foregroundColor
  },
  menuProfileStatLeft: {
    paddingRight: 3,
    paddingBottom: 1,
    paddingLeft: 4,
    lineHeight: 16,
    fontSize: 10,
  },
  menuProfileStatRight: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 1,
    lineHeight: 16,
    fontSize: 10,
  },

  menuProfileStatActive: {
    color: theme.base.backgroundColor,
    backgroundColor: theme.tonedDown.foregroundColor
  },
  menuProfileStatInactive: {
    color: theme.tonedDown.foregroundColor,
    backgroundColor: 'transparent'
  },

  menuListSeparator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.tonedDown.backgroundColor
  },

  packages: {
    flex: 1,
    backgroundColor: theme.main.backgroundColor
  },
  packagesList: {
    flexGrow: 1
  },
  packagesHeader: {
    flex: 1,
    height: 100,
    padding: 20,
    paddingBottom: 10,
  },
  packagesHeaderAuthor: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packagesHeaderProfile: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packagesProfileImage: {
    flex: 0,
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: theme.main.decorationColor,
    ...Platform.select({
      android: {
        backgroundColor: theme.main.backgroundColor
      },
    })
  },
  packageProfileUser: {
    flex: 0,
    flexDirection: 'column',
  },
  packageProfileUserName: {
    flex: 1,
    fontSize: 14,
    lineHeight: 14,
    textAlign: 'left',
    color: theme.tonedDown.foregroundColor,
  },
  packagesHeaderDownloads: {
    flex: 0,
    flexDirection: 'column',
    top: -2,
    minWidth: 125,
  },
  packagesHeaderDownloadsColumns: {
    flex: 1,
    flexDirection: 'row'
  },
  packagesHeaderDownloadsColumnsLabel: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
    color: theme.base.accentColor
  },
  packagesHeaderDownloadsStats: {
    flex: 2,
    flexDirection: 'row'
  },
  packagesHeaderDownloadsStatsSep: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: theme.tonedDown.foregroundColor
  },
  packagesHeaderDownloadsStatsValue: {
    flex: 4,
    fontSize: 12,
    textAlign: 'center',
    color: theme.tonedDown.foregroundColor
  },
  packagesHeaderControl: {
    flex: 0,
    flexDirection: 'row',
    top: -5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  packagesAuthorToggle: {
    flex: 0,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.emphasis.backgroundColor
  },
  packagesAuthorInactive: {
    color: theme.emphasis.backgroundColor,
    backgroundColor: 'transparent'
  },
  packagesAuthorActive: {
    color: theme.emphasis.foregroundColor,
    backgroundColor: theme.emphasis.backgroundColor
  },
  packagesAuthorOnly: {
    paddingTop: 1,
    paddingRight: 7,
    paddingBottom: 2,
    paddingLeft: 9,
    lineHeight: 20,
  },
  packagesAuthorAll: {
    paddingTop: 1,
    paddingRight: 8,
    paddingBottom: 2,
    paddingLeft: 8,
    lineHeight: 20
  },
  packagesProfileUpdated: {
    position: 'absolute',
    right: 5,
    bottom: 2,
    left: 5,
    fontSize: 8,
    textAlign: 'center',
    color: theme.base.accentColor
  },
  packagesTotal: {
    position: 'absolute',
    right: 15,
    bottom: -9,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'right',
    color: theme.base.accentColor,
    opacity: 0.65
  },

  packageContainer: {
    height: 80,
    paddingHorizontal: 20,
    backgroundColor: theme.main.highlightColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.main.decorationColor
  },
  packageItem: {
    flex: 1,
    height: 20,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  packageDate: {
    position: 'absolute',
    top: 35,
    left: 20,
    fontSize: 10,
    color: theme.base.accentColor,
  },
  packageName: {
    color: theme.main.textColor,
    lineHeight: 50,
    fontSize: 16,
    ...Platform.select({
      android: {
        lineHeight: 35
      },
    })
  },
  packageVersion: {
    color: theme.tonedDown.foregroundColor,
    lineHeight: 50,
    ...Platform.select({
      android: {
        lineHeight: 35
      },
    })
  },
  packageDownloads: {
    flex: 1,
    flexDirection: 'column',
    height: 60
  },
  packageDownloadsStats: {
    bottom: -8,
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'right',
    color: theme.base.foregroundColor,
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        bottom: -5
      },
    })
  },

  details: {
    flex: 1,
    backgroundColor: theme.main.backgroundColor,
  },
  detailsContainer: {
    flex: 0, // important to make ScrollView to scroll
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  detailsKeywords: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  detailsKeywordsWord: {
    flex: 0,
    height: 14,
    marginHorizontal: 4,
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 10,
    lineHeight: 10,
    textAlign: 'center',
    color: theme.tonedDown.foregroundColor,
    backgroundColor: theme.main.backgroundColor,
  },
  detailsChart: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: 300,
    height: 200,
    color: theme.main.foregroundColor,
    borderTopColor: theme.tonedDown.foregroundColor, // used for drawing with chart, not the container
    borderBottomColor: theme.main.highlightColor, // used for drawing with chart, not the container
    borderWidth: StyleSheet.hairlineWidth, // used for drawing with chart, not the container
    borderRadius: 5,
    overflow: 'hidden'
  },
  detailsChartTicks: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 25,
    height: 200,
  },
  detailsChartTicksLabel: {
    position: 'absolute',
    left: 2,
    fontSize: 8,
    color: theme.base.accentColor,
    backgroundColor: 'transparent',
  },
  detailsUpdated: {
    position: 'absolute',
    top: 20,
    right: 25,
    fontSize: 10,
    textAlign: 'center',
    color: theme.base.accentColor
  },
  detailsSection: {
    flex: 0,
    color: theme.base.accentColor,
    marginTop: 15,
    paddingLeft: 5,
    paddingBottom: 5
  },
  detailsSectionFootnote: {
    position: 'absolute',
    right: 0,
    bottom: -12,
    left: 0,
    fontSize: 10,
    textAlign: 'center',
    color: theme.base.accentColor,
    backgroundColor: 'transparent'
  },
  detailsSectionContent: {
    flex: 0,
    borderWidth: 1,
    borderColor: theme.main.decorationColor,
    backgroundColor: theme.main.highlightColor,
    borderRadius: 5
  },
  detailsSectionContentText: {
    margin: 10,
    color: theme.main.textColor
  },
  detailsSectionContentDrawers: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.main.decorationColor
  },
  detailsSectionContentMessage: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    textAlign: 'center',
    color: theme.main.decorationColor,
  },
  detailsSectionContentLabeledText: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
    color: theme.tonedDown.foregroundColor,
  },
    detailsSectionContentLabeledTextEmphasis : {
      color: theme.emphasis.foregroundColor,
      backgroundColor: theme.emphasis.backgroundColor
    },
    detailsSectionContentLabeledTextMedium: {
      paddingTop: 15,
      fontSize: 12
    },
    detailsSectionContentLabeledTextLong: {
      paddingBottom: 4,
      fontSize: 8
    },
  detailsSectionContentLinkedText: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
    color: theme.actionable.activeColor,
    backgroundColor: 'transparent',
  },
  detailsMaintainersListContainer: {
    flexGrow: 1
  },
  detailsMaintainersList: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    paddingRight: 0,
    ...Platform.select({
      android: {
        paddingBottom: 0
      }
    })
  },
  detailsMaintainersProfile: {
    ...Platform.select({
      android: {
        paddingBottom: 10
      }
    })
  },
  detailsMaintainersProfileImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.main.decorationColor,
  },
    detailsMaintainersProfileHighlightedImage: {
      borderColor: theme.main.foregroundColor,
    },
  detailsMaintainersProfileName: {
    position: 'absolute',
    flex: 1,
    left: -15,
    right: -5,
    bottom: -10,
    fontSize: 8,
    lineHeight: 10,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: theme.base.accentColor,
    ...Platform.select({
      android: {
        bottom: 0
      }
    })
  },
  detailsDependenciesSectionHeader: {
    flex: 1,
    padding: 5,
    paddingLeft: 10,
    backgroundColor: theme.main.highlightColor,
    ...Platform.select({
      android: {
        minHeight: 20
      }
    })
  },
  detailsDependenciesSectionHeaderLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    color: theme.tonedDown.foregroundColor,
    ...Platform.select({
      android: {
        flex: 1,
        top: 0,
        paddingVertical: 10,
        lineHeight: 1,
        borderWidth: 1,
        borderColor: theme.main.highlightColor, // keep it detailsDependenciesSectionHeader.backgroundColor
      }
    })
  },
  detailsDependenciesRow: {
      flex: 0,
      flexDirection: 'row',
      paddingLeft: 20,
      paddingVertical: 10,
      borderColor: theme.main.decorationColor,
      backgroundColor: 'transparent'
  },
    detailsDependenciesRowAlt: {
      backgroundColor: theme.main.overlayColor
    },
    detailsDependenciesHeader: {
      borderTopWidth: 0,
      borderBottomWidth: 1,
      zIndex: 1
    },
  detailsDependenciesCell: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
    detailsDependenciesCellPackage: {
      flex: 2,
      alignItems: 'flex-start'
    },
  detailsDependenciesCellLabel: {
    fontSize: 12,
    color: theme.main.textColor
  },
    detailsDependenciesHeaderCellLabel: {
      color: theme.tonedDown.foregroundColor
    },
  detailsDependenciesList: {
    flexGrow: 1,
    maxHeight: 170,
    borderRadius: 5,
    overflow: 'hidden'
  },
  detailsDependenciesListContent: {
    ...Platform.select({
      android: {
        paddingBottom: 20
      }
    })
  },

  about: {
    flex: 1,
    backgroundColor: theme.main.backgroundColor
  },
  aboutContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 80,
  },
  aboutHeader: {
    marginTop: 25,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.tonedDown.foregroundColor,
    textAlign: 'left',
  },
  aboutParagraph: {
    fontSize: 14,
    color: theme.main.textColor,
    textAlign: 'left'
  },
  aboutParagraphLink: {
    fontSize: 14,
    color: theme.actionable.activeColor,
    backgroundColor: 'transparent',
  },
  aboutButton: {
    position: 'absolute',
    left: 30,
    right: 30,
    bottom: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.emphasis.backgroundColor,
    borderRadius: 5
  },
  aboutButtonText: {
    flex: 0,
    fontWeight: 'bold',
    fontSize: 14,
    color: theme.emphasis.foregroundColor,
    textAlign: 'center',

  },

  welcome: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: theme.main.backgroundColor
  },
  welcomeText: {
    width: 200,
    height: 20,
    fontSize: 14,
    color: theme.tonedDown.foregroundColor,
    textAlign: 'center'
  },
  welcomeImage: {
    width: 150,
    height: 150
  },

  splash: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: theme.emphasis.backgroundColor
  },
  splashImage: {
    width: 128,
    height: 128
  },
};
