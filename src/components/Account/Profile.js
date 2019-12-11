import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Linking } from 'react-native';
import { Container, Content, Text, Thumbnail, Button } from 'native-base';
import styles from './ProfileStyle';
import * as inviteActions from '../Invite/actions';
import inviteStore from '../Invite/InviteStore';
import * as jobActions from '../MyJobs/actions';
import jobStore from '../MyJobs/JobStore';
import accountStore from './AccountStore';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import {
  CustomToast,
  Loading,
  BackgroundHeader,
} from '../../shared/components';
import { UPLOAD_DOCUMENT_ROUTE } from '../../constants/routes';
import PROFILE_IMG from '../../assets/image/profile.png';
import EditProfile from './EditProfile';
import { TabHeader } from '../../shared/components/TabHeader';
import PublicProfile from './PublicProfile';
import { BankAccounts } from '../BankAccounts/BankAccounts';

class Profile extends Component {
  static navigationOptions = {
    tabBarLabel: i18next.t('PROFILE.profile'),
    tabBarIcon: () => (
      <Image
        style={{ resizeMode: 'contain', width: 42, height: 42 }}
        source={require('../../assets/image/tab/profile.png')}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
      starsArray: [1, 2, 3, 4, 5],
      ratings: [],
      profile: {},
      completed: 0,
    };
  }

  componentDidMount() {
    this.getProfileSubscription = inviteStore.subscribe(
      'GetProfile',
      this.getProfileHandler,
    );
    this.editProfileSubscription = accountStore.subscribe(
      'EditProfile',
      this.getProfile,
    );
    this.getEmployeeRatingsSubscription = jobStore.subscribe(
      'GetEmployeeRatings',
      this.getEmployeeRatingsHandler,
    );
    this.inviteStoreError = inviteStore.subscribe(
      'InviteStoreError',
      this.errorHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.firstLoad();
    this.updateCompleted();
  }

  componentWillUnmount() {
    this.getProfileSubscription.unsubscribe();
    this.editProfileSubscription.unsubscribe();
    this.getEmployeeRatingsSubscription.unsubscribe();
    this.inviteStoreError.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getProfileHandler = (profile) => {
    this.setState(
      {
        profile,
        isLoading: false,
      },
      this.updateCompleted,
    );
  };

  getEmployeeRatingsHandler = (ratings) => {
    if (Array.isArray(ratings)) {
      if (ratings.length <= 2) return this.setState({ ratings });

      const lastTwoElements = ratings.slice(ratings.length - 2, ratings.length);
      this.setState({ ratings: lastTwoElements });
    }
  };

  errorHandler = (err) => {
    this.setState({ isLoading: false, isRefreshing: false });
    CustomToast(err, 'danger');
  };

  goToBankAccounts = () => {
    this.props.navigation.navigate(BankAccounts.routeName);
  };

  render() {
    return (
      <I18n>
        {(t) => (
          <Container>
            {this.state.isLoading ? <Loading /> : null}
            <TabHeader
              screenName="profile"
              title={t('PROFILE.profileSettings')}
              onPressHelp={() => Linking.openURL('https://support.jobcore.co/')}
            />
            <Content>
              <BackgroundHeader heightAuto>
                <View style={{ padding: 30 }}>
                  <View style={styles.viewProfileImg}>
                    <Thumbnail
                      large
                      source={
                        this.state.profile && this.state.profile.picture
                          ? { uri: this.state.profile.picture }
                          : PROFILE_IMG
                      }
                    />
                  </View>
                  {this.state.profile && this.state.profile.user ? (
                    <Text style={styles.titleTextName}>
                      {`${this.state.profile.user.first_name} ${
                        this.state.profile.user.last_name
                      }`}
                    </Text>
                  ) : null}
                  {this.state.profile && this.state.profile.user ? (
                    <Text style={styles.titleTextName}>
                      {`${this.state.profile.user.email}`}
                    </Text>
                  ) : null}
                </View>
              </BackgroundHeader>
              <TouchableOpacity onPress={this.goToEditProfile}>
                <View style={styles.profileButton}>
                  <Text style={styles.buttonTextName}>
                    {t('PROFILE.editProfile')}
                  </Text>
                  <Button transparent>
                    <Image
                      style={styles.buttonIcon}
                      source={require('../../assets/img/next.png')}
                    />
                  </Button>
                </View>
              </TouchableOpacity>
              <View style={styles.darkLine} />
              <TouchableOpacity onPress={this.goToPublicProfile}>
                <View style={styles.profileButton}>
                  <Text style={styles.buttonTextName}>
                    {t('PROFILE.publicProfile')}
                  </Text>
                  <Button transparent>
                    <Image
                      style={styles.buttonIcon}
                      source={require('../../assets/img/next.png')}
                    />
                  </Button>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={this.goToAddBankAccount}>
                <View style={styles.profileButton}>
                  <Text style={styles.buttonTextName}>
                    {t('PROFILE.bankAccounts')}
                  </Text>
                  <Button transparent>
                    <Image
                      style={styles.buttonIcon}
                      source={require('../../assets/img/next.png')}
                    />
                  </Button>
                </View>
              </TouchableOpacity> */}
              <View style={styles.darkLine} />
              <TouchableOpacity onPress={this.goToMyDocuments}>
                <View style={styles.profileButton}>
                  <Text style={styles.buttonTextName}>
                    {t('USER_DOCUMENTS.uploadDocuments')}
                  </Text>
                  <Button transparent>
                    <Image
                      style={styles.buttonIcon}
                      source={require('../../assets/img/next.png')}
                    />
                  </Button>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL('https://jobcore.com/community-guidelines/')
                }>
                <View style={styles.profileButton}>
                  <Text style={styles.buttonTextName}>
                    {t('PROFILE.communityGuidlines')}
                  </Text>
                  <Button transparent>
                    <Image
                      style={styles.buttonIcon}
                      source={require('../../assets/img/next.png')}
                    />
                  </Button>
                </View>
              </TouchableOpacity>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }

  firstLoad = () => {
    this.setState({ isLoading: true }, () => {
      this.getProfile();
      this.getEmployeeRatings();
    });
  };

  getProfile = () => {
    inviteActions.getProfile();
  };

  getEmployeeRatings = () => {
    jobActions.getEmployeeRatings();
  };

  goToEditProfile = () => {
    this.props.navigation.navigate(EditProfile.routeName);
  };

  goToMyDocuments = () => {
    this.props.navigation.navigate(UPLOAD_DOCUMENT_ROUTE);
  };

  goToPublicProfile = () => {
    this.props.navigation.navigate(PublicProfile.routeName);
  };

  updateCompleted() {
    let { completed, profile } = this.state;

    if (profile) {
      completed += this.state.profile.picture ? 50 : 0;
      completed += this.state.profile.bio ? 50 : 0;

      this.setState({ completed });
    }
  }
}

Profile.routeName = 'Profile';

export default Profile;
