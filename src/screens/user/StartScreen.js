import Background from '../../components/Background'

import Header from '../../components/Header'
import Button from '../../components/Button'
import Start_view from '../../components/Start_view'
import Paragraph from '../../components/Paragraph'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Header>DESOCIAL MEDIA</Header>
      <Paragraph>Location based business from the 0X21</Paragraph>
      <Start_view mode="outlined">
        <Button mode="outlined" onPress={() => navigation.navigate('Signin')}>
          SIGN IN
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('Signup')}>
          SIGN UP
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('Recover')}>
          RECOVER ACCOUNT
        </Button>
      </Start_view>
    </Background>
  )
}
