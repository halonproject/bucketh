const { assertRevert } = require("./helpers/assertThrow")
const Bucket = artifacts.require("Bucket")

contract("Bucket", accounts => {
    let bucket = {}

    let owner = accounts[0]

    before("Deploy bucket contract", async () => {
        bucket = await Bucket.new({from: owner})
        assert.ok(bucket)
        assert.equal(await bucket.owner(), owner, "Bucket contract owner should be " + owner)
    })

    after("Destroy bucket", async () => {
        await bucket.destroy({from: owner})
    })

    context("file handling", async () => {
        it("add file", async () => {
            assert.ok(await bucket.addFile("fakehash123abc", "foo.txt", 512, true, {from: owner}))
        })

        it("get file", async () => {
            let file = await bucket.getFile(1)

            assert.equal(file[0], "fakehash123abc")
            assert.equal(file[1], "foo.txt")
            assert.equal(file[2], 512)
            assert.equal(file[3], true)
            assert.equal(file[4], false)
            assert.equal(file[5], owner)
        })

        it("rename file", async () => {
            await bucket.setFileName(1, "bar.txt", {from: owner})

            let file = await bucket.getFile(1)
            assert.equal(file[0], "fakehash123abc")
            assert.equal(file[1], "bar.txt")
            assert.equal(file[2], 512)
            assert.equal(file[3], true)
            assert.equal(file[4], false)
            assert.equal(file[5], owner)
        })

        it("replace file", async () => {
            await bucket.setFileContent(1, "QmeHiTqVSKdzB8K6RCpFUsSsxFB96fAz8ZkjAn2erVCYPE", 5260, {from: owner})

            let file = await bucket.getFile(1)
            assert.equal(file[0], "QmeHiTqVSKdzB8K6RCpFUsSsxFB96fAz8ZkjAn2erVCYPE")
            assert.equal(file[1], "bar.txt")
            assert.equal(file[2], 5260)
            assert.equal(file[3], true)
            assert.equal(file[4], false)
            assert.equal(file[5], owner)
        })

        context("permissions", async () => {
            it("owner has read permissions", async () => {
                assert.isTrue(await bucket.hasReadAccess(1, owner))
            })

            it("owner has write permissions", async () => {
                assert.isTrue(await bucket.hasWriteAccess(1, owner))
            })

            it("non-owner account should not have read permissions", async () => {
                assert.isFalse(await bucket.hasReadAccess(1, accounts[1]))
            })

            it("non-owner account should not have write permissions", async () => {
                assert.isFalse(await bucket.hasWriteAccess(1, accounts[1]))
            })

            it("non-owner cannot set read permission", async () => {
                return assertRevert( async () => {
                    await bucket.setReadPermission(1, accounts[1], true, {from: accounts[1]})
                })
            })

            it("non-owner cannot set write permission", async () => {
                return assertRevert( async () => {
                    await bucket.setWritePermission(1, accounts[1], true, {from: accounts[1]})
                })
            })

            it("owner can grant read permisssion", async () => {
                await bucket.setReadPermission(1, accounts[1], true, {from: owner})

                assert.isTrue(await bucket.hasReadAccess(1, accounts[1]))
            })

            it("owner can grant write permisssion", async () => {
                await bucket.setWritePermission(1, accounts[1], true, {from: owner})

                assert.isTrue(await bucket.hasWriteAccess(1, accounts[1]))
            })
        })
    })
})
