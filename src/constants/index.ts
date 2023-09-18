const TestnetInfo = {
    JoyIDLockScript: {
      codeHash: '0xd23761b364210735c19c60561d213fb3beae2fd6172743719eff6920e020baac',
      hashType: 'type',
      args: '',
    } as CKBComponents.Script,
  
    JoyIDLockDep: {
      outPoint: { txHash: '0x437d4343c1eb5901c74ba34f6e9b1a1a25d72b441659d73bb1b40e9924bda6fb', index: '0x0' },
      depType: 'depGroup',
    } as CKBComponents.CellDep,
  
    CotaTypeScript: {
      codeHash: '0x89cd8003a0eaf8e65e0c31525b7d1d5c1becefd2ea75bb4cff87810ae37764d8',
      hashType: 'type',
      args: '0x',
    } as CKBComponents.Script,
  
    CotaTypeDep: {
      outPoint: { txHash: '0x636a786001f87cb615acfcf408be0f9a1f077001f0bbc75ca54eadfe7e221713', index: '0x0' },
      depType: 'depGroup',
    } as CKBComponents.CellDep,
  }
  
  const MainnetInfo = {
    JoyIDLockScript: {
      codeHash: '0x9302db6cc1344b81a5efee06962abcb40427ecfcbe69d471b01b2658ed948075',
      hashType: 'type',
      args: '',
    } as CKBComponents.Script,
  
    JoyIDLockDep: {
      outPoint: { txHash: '0xfa683440f605af7cc117755f8bcf6acec70fc4a69265602117810dfa41444159', index: '0x0' },
      depType: 'depGroup',
    } as CKBComponents.CellDep,
  
    CotaTypeScript: {
      codeHash: '0x1122a4fb54697cf2e6e3a96c9d80fd398a936559b90954c6e88eb7ba0cf652df',
      hashType: 'type',
      args: '0x',
    } as CKBComponents.Script,
  
    CotaTypeDep: {
      outPoint: { txHash: '0x875db3381ebe7a730676c110e1c0d78ae1bdd0c11beacb7db4db08e368c2cd95', index: '0x0' },
      depType: 'depGroup',
    } as CKBComponents.CellDep,
  }

export const getJoyIDLockScript = (isMainnet: boolean = false) => 
    isMainnet ? MainnetInfo.JoyIDLockScript : TestnetInfo.JoyIDLockScript