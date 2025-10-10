# TP-GreenTrip

## Backend

### Objets

- `User`
    - UserId: `number`
    - Name: `string`
    - Email: `string`
    - Password: `string`
    - AuthProvider `"local" | "google"`
    - AuthProviderId: `string`
    - Bookings: `[Booking]`

- `Trip`
    - TripId: `number`
    - UserId: `number`
    - Start: `string`
    - End: `string`
    - TransportMode: `string`
    - Places: `number`
    - Price: `number`

- `Booking`
    - BookId: `number`
    - UderId: `number`
    - TripId: `number`
    - Date: `datetime`

### Fonctions

- `createAccount`
    - Paramètres: 
        - name: `string`
        - email: `string`
        - password: `string`
    - Retourne un dictionnaire avec les clés:
        - success: `bool`
        - message: `string?`
        - user: `User`
- `login`
    - Paramètres:
        - email: `string`
        - password: `string`
    - Retourne un dictionnaire avec les clés:
        - success: `bool`
        - message: `string`
        - user: `User`
- `deleteAccount`
    - Paramètre:
        - email: `string`
    - Retourne un dictionnaire avec les clés:
        - success: `bool`
        - message: `string`
