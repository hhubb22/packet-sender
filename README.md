# PacketForge

PacketForge is a web-based application designed for crafting, sending, and analyzing network packets. It provides a user-friendly interface to interact with network interfaces on a remote server, send custom packets, and inspect packet data from PCAP files. This tool is ideal for network testing, security analysis, and educational purposes related to network protocols.

## Features

*   **Remote Server Connection:** Connect to a specified server using its IP address and port.
*   **Network Interface Selection:** List and select available network interfaces on the connected server.
*   **Manual Packet Crafting:** Manually create and send network packets using hexadecimal input.
*   **PCAP File Upload:** Upload PCAP (Packet Capture) files to the application.
*   **Packet Extraction from PCAP:** Extract and list individual packets from uploaded PCAP files.
*   **Send Packets from PCAP:** Select and send packets that have been extracted from PCAP files.
*   **Packet Detail Viewing:** Inspect detailed information about sent or selected packets.
*   **Activity Log:** Keep track of all major actions performed within the application, such as server connections, packet sending, and errors.
*   **User-Friendly Interface:** Intuitive navigation and clear layout for ease of use.

## Tech Stack

PacketForge is built using modern web technologies:

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that enhances code quality and maintainability.
*   **Vite:** A fast build tool and development server for modern web projects.
*   **React Router:** For handling navigation within the single-page application.

## Getting Started

Follow these instructions to get PacketForge up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js:** Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hhubb22/packet-sender.git
    cd packetforge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    PacketForge is a frontend application that requires a backend server to connect to. This backend server is responsible for listing network interfaces and sending packets on the host machine.
    *   **This repository contains only the frontend part of PacketForge.** You will need to have a compatible backend server running and accessible to the machine where you run PacketForge.
    *   The application will ask for the IP address and port of this backend server to establish a connection.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, and you can access PacketForge in your web browser (usually at `http://localhost:5173` or another port specified by Vite).

## Usage

The typical workflow for using PacketForge is as follows:

1.  **Connect to Server:** Start the application and enter the IP address and port of your running backend packet server.
2.  **Select Interface:** Once connected, choose a network interface from the list provided by the server.
3.  **Navigate to Packet Editor:** Go to the "Packet Editor" section.
4.  **Craft or Upload:**
    *   **Manual Mode:** Enter the packet data in hexadecimal format in the input field.
    *   **PCAP Mode:** Upload a PCAP file. The application will list the packets found in the file.
5.  **Send Packet(s):**
    *   In manual mode, click "Send".
    *   In PCAP mode, select a packet from the list and click "Send".
6.  **Monitor Activity:** Use the "Activity Log" to see a history of your actions and any responses or errors. Click on specific log entries or packets in the editor to view more details.

## Contributing

Contributions are welcome! If you have suggestions for improvements or encounter any issues, please feel free to:

*   Open an issue to report bugs or suggest features.
*   Submit a pull request with your enhancements.

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
