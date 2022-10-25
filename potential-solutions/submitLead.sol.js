const submitLead = require('../submitLead');
const leadService = require('../leadService');

jest.mock('../leadService');

afterEach(() => {
    jest.resetAllMocks();
})

// replace 'sol' in the filename with 'test' to run these
describe('submitLead', () => {
    it('successfully submits leads', async () => {
        // arrange (given)
        const testData = { body: 'testData' };
        const mockResponse = {
            status: 200,
            data: '1234'
        }
        leadService.send.mockResolvedValue(mockResponse);

        // act (when)
        const result = await submitLead(testData);

        // assert (then)
        expect(result).toEqual(mockResponse.data);
        const firstArgOfSendFunction = leadService.send.mock.calls[0][0];
        expect(firstArgOfSendFunction).toEqual(testData);
    })

    it('calls error fn when 500 returned', async () => {
        const testData = { body: 'testData' };
        const mockErrorFn = jest.fn(() => 'api broke');
        const mockResponse = {
            status: 500,
            data: 'error'
        }
        leadService.send.mockResolvedValue(mockResponse);

        const result = await submitLead(testData, mockErrorFn);

        expect(mockErrorFn).toBeCalledWith();
        expect(result).toEqual('api broke');
        expect(leadService.send).toBeCalledWith(testData);
    })

    it('throws for errors response status that is not 2xx or 5xx', async () => {
        const testData = { body: 'testData' };
        const mockResponse = {
            status: 400,
            data: 'bad request'
        }
        leadService.send.mockResolvedValue(mockResponse);

        await expect(submitLead(testData)).rejects.toThrow(mockResponse.data);
    })
});