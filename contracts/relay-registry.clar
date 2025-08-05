;; Relay Registry Contract - Clarity v2
;; Part of Relayroot decentralized infrastructure network

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-NODE-ALREADY-REGISTERED u101)
(define-constant ERR-NODE-NOT-FOUND u102)
(define-constant ERR-STAKING-REQUIRED u103)
(define-constant ERR-INVALID-METADATA u104)

(define-constant NODE-TYPES (list 3 "relay" "rpc" "indexer"))

;; Admin
(define-data-var admin principal tx-sender)

;; Registered node structure
(define-map node-registry
  principal
  {
    node-type: (string-ascii 12),
    metadata-uri: (string-ascii 256),
    registered-at: uint,
    last-updated: uint
  }
)

;; Link to staking contract - replace with real contract ID
(define-constant STAKING-VAULT 'ST000000000000000000002AMW42H.vault)

;; --- Utility ---

(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-private (valid-node-type (t (string-ascii 12)))
  (contains NODE-TYPES t)
)

;; --- Public Functions ---

(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)

(define-public (register-node (node-type (string-ascii 12)) (metadata-uri (string-ascii 256)))
  (let (
    (existing (map-get? node-registry tx-sender))
    (now block-height)
  )
    (begin
      (asserts! (is-none existing) (err ERR-NODE-ALREADY-REGISTERED))
      (asserts! (valid-node-type node-type) (err ERR-INVALID-METADATA))
      (asserts! (> (unwrap-panic (contract-call? STAKING-VAULT get-stake tx-sender)) u0) (err ERR-STAKING-REQUIRED))
      (map-set node-registry tx-sender {
        node-type: node-type,
        metadata-uri: metadata-uri,
        registered-at: now,
        last-updated: now
      })
      (ok true)
    )
  )
)

(define-public (update-node-metadata (new-metadata-uri (string-ascii 256)))
  (let (
    (entry (map-get? node-registry tx-sender))
    (now block-height)
  )
    (match entry
      some-node
        (begin
          (map-set node-registry tx-sender {
            node-type: (get node-type some-node),
            metadata-uri: new-metadata-uri,
            registered-at: (get registered-at some-node),
            last-updated: now
          })
          (ok true)
        )
      (err ERR-NODE-NOT-FOUND)
    )
  )
)

(define-public (deregister-node)
  (begin
    (asserts! (is-some (map-get? node-registry tx-sender)) (err ERR-NODE-NOT-FOUND))
    (map-delete node-registry tx-sender)
    (ok true)
  )
)

;; --- Read-only ---

(define-read-only (get-node (owner principal))
  (let ((entry (map-get? node-registry owner)))
    (match entry
      some-node (ok some-node)
      (err ERR-NODE-NOT-FOUND)
    )
  )
)

(define-read-only (get-admin)
  (ok (var-get admin))
)
