describe('Reservations', () => {
    let jwt: string;
  
    beforeAll(async () => {
      const user = {
        email: "vanto8899@gmail.com",
        password: "Abc123456!"
      };
      await fetch('http://auth:3001/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await fetch('http://auth:3001/auth/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      jwt = await response.text();
    });
  
    test('Create & Get', async () => {
      const createdReservation = await createReservation();
      const responseGet = await fetch(
        `http://reservations:3000/reservations/${createdReservation._id}`,
        {
          headers: {
            Authentication: jwt,
          },
        },
      );
      const reservation = await responseGet.json();
      expect(createdReservation).toEqual(reservation);
    });
  
    const createReservation = async () => {
      const responseCreate = await fetch(
        'http://reservations:3000/reservations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authentication: jwt,
          },
          body: JSON.stringify({
            startDate: '11-22-2024',
            endDate: '11-23-2024',
            placeId: '1234',
            invoiceId: '1231',
            charge: {
              amount: 13,
              card: {
                cvc: '413',
                exp_month: 12,
                exp_year: 2027,
                number: '4242 4242 4242 4242',
              },
            },
          }),
        },
      );
      expect(responseCreate.ok).toBeTruthy();
      return responseCreate.json();
    };
  });