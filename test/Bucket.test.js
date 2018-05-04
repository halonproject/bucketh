const Bucket = artifacts.require("Bucket")

contract("Bucket", accounts => {
    let bucket = {}

    let owner = accounts[0]

    before("Deploy bucket contract", async () => {
        bucket = await Bucket.new({from: owner})
        assert.ok(bucket)
        assert.equal(await bucket.owner(), owner, "Bucket contract owner should be " + owner)
    })

    context("files handling", async () => {
        it("add file", async () => {
            await bucket.addFile("foo.txt", "fakehash123abc", {from: owner})

            let file = await bucket.totalFiles()
            assert.equal(file.toNumber(), 1, "bucket should only contain 1 file")
        })

        it("should not re-add existing file", async () => {
            await bucket.addFile("foo.txt", "fakehash123abc", {from: owner})

            let file = await bucket.totalFiles()
            assert.equal(file.toNumber(), 1, "bucket should only contain 1 file")
        })

        it("check ipfs hash", async () => {
            assert.equal(await bucket.ipfsHash("foo.txt", {from: owner}), "fakehash123abc")
        })

        it("update ipfs hash", async () => {
            await bucket.setIPFSHash("foo.txt", "QmeHiTqVSKdzB8K6RCpFUsSsxFB96fAz8ZkjAn2erVCYPE", {from: owner})

            assert.equal(await bucket.ipfsHash("foo.txt", {from: owner}), "QmeHiTqVSKdzB8K6RCpFUsSsxFB96fAz8ZkjAn2erVCYPE")
        })

        it("cannot update ipfs hash of file not in bucket", async () => {
            await bucket.setIPFSHash("bar.txt", "fakehash123abc", {from: owner})
            assert.equal(await bucket.ipfsHash("bar.txt", {from: owner}), "")
        })

        it("cannot remove non-existent file", async () => {
            await bucket.removeFile("bar.txt")

            let files = await bucket.totalFiles()
            assert.equal(files.toNumber(), 1, "bucket should still have one file in it")
        })

        it("remove file", async () => {
            await bucket.removeFile("foo.txt")

            let files = await bucket.totalFiles()
            assert.equal(files.toNumber(), 0, "bucket should not have any files in it")
        })

        it("re-add removed file", async () => {
            await bucket.addFile("foo.txt", "fakehash123abc", {from: owner})

            let file = await bucket.totalFiles()
            assert.equal(file.toNumber(), 1, "bucket should only contain 1 file")
        })
    })
})
