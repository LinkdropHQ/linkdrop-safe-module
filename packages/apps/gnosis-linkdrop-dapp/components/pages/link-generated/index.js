import React from 'react'
import { Page } from 'components/pages'
import { translate } from 'decorators'
import { CopyTextBlock, Button } from 'components/common'
import { Icons } from '@linkdrop/ui-kit'
import styles from './styles.module'
import variables from 'variables'

@translate('pages.linkGenerated')
class LinkGenerated extends React.Component {
  render () {
    return <Page>
      <div className={styles.title}>
        <div className={styles.indicator}>
          <Icons.CheckSmall stroke={variables.greenColor} width={14} height={9} viewBox='0 0 22 14' />
        </div>
        {this.t('titles.linkGenerated')}
      </div>
      <CopyTextBlock
        value='http://localhost:9002/#/receive?weiAmount=1000000000000000&tokenAddress=0x0000000000000000000000000000000000000000&tokenAmount=0&expirationTime=1900000000000&version=2&chainId=4&linkKey=0xc53a20fd821ac7870984f5fbe45ac07083235846f0b8950a0d9aeb9a544f6b5a&linkdropMasterAddress=0xcf14961ff792109fc3762e9d329822c6c75a9756&linkdropSignerSignature=0x78c9208b42bd05ae44b9f46e34714787e1daca8e8ba20a41f120232e4ae03fad518c00e857d537b0d10c7b36077975dbd98b549d4a5c78e7d23e387bedcc82ea1c&campaignId=5'
      />
      <Button>{this.t('buttons.copy')}</Button>
    </Page>
  }
}

export default LinkGenerated
