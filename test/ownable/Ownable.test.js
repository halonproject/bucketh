const { assertRevert } = require('../helpers/assertThrow');

const Ownable = artifacts.require('Ownable');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('Ownable', accounts => {
  let ownable;

  beforeEach(async () => {
    ownable = await Ownable.new();
  });

  it('should have an owner', async () => {
    let owner = await ownable.owner();
    assert.isTrue(owner !== 0);
  });

  it('changes owner after transfer', async () => {
    let other = accounts[1];
    await ownable.transferOwnership(other);
    let owner = await ownable.owner();

    assert.isTrue(owner === other);
  });

  it('should prevent non-owners from transfering', async () => {
    const other = accounts[2];
    const owner = await ownable.owner.call();
    assert.isTrue(owner !== other);
    return assertRevert( async () => {
        await ownable.transferOwnership(other, { from: other })
    });
  });

  it('should guard ownership against stuck state', async () => {
    let originalOwner = await ownable.owner();
    return assertRevert( async () => {
        await ownable.transferOwnership(null, { from: originalOwner })
    });
  });

  it('loses owner after renouncement', async () => {
    await ownable.renounceOwnership();
    let owner = await ownable.owner();

    assert.isTrue(owner === ZERO_ADDRESS);
  });

  it('should prevent non-owners from renouncement', async () => {
    const other = accounts[2];
    const owner = await ownable.owner.call();
    assert.isTrue(owner !== other);
    return assertRevert( async () => {
        await ownable.renounceOwnership({ from: other })
    });
  });
});
