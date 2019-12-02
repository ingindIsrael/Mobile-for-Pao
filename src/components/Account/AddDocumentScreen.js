import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Item,
  Button,
  Text,
  Form,
  Label,
  Content,
  Container,
} from 'native-base';
import UploadDocumentStyle from './UploadDocumentStyle';
import { I18n } from 'react-i18next';
import { Loading } from '../../shared/components';
import { ModalHeader } from '../../shared/components/ModalHeader';
class AddDocumentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  render() {
    return (
      <I18n>
        {(t) => (
          <Container>
            <ModalHeader
              screenName={t('EDIT_PROFILE.addDocumentsTitle')}
              title={t('EDIT_PROFILE.addDocumentsTitle')}
            />
            {this.state.isLoading ? <Loading /> : null}
            <Content>
              <View style={UploadDocumentStyle.container}>
                <View>
                  <Form>
                    <Item
                      style={UploadDocumentStyle.viewInput}
                      inlineLabel
                      rounded>
                      <Label>TitleDocument</Label>
                    </Item>
                  </Form>
                  <Button
                    full
                    onPress={() => this.setState({ status: '' })}
                    style={UploadDocumentStyle.viewButtomLogin}>
                    <Text style={UploadDocumentStyle.textButtom}>
                      {t('EDIT_PROFILE.loadDocument')}
                    </Text>
                  </Button>
                </View>
              </View>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }
}
export default AddDocumentScreen;